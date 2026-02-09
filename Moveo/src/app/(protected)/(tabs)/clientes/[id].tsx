import React, { useCallback, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Linking, Platform } from "react-native";
import { useLocalSearchParams, Stack, useFocusEffect, router } from "expo-router";
import { useTheme } from "react-native-paper";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { InfoCard, InfoCardPedidos } from "../../../../components/CardApp";
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { idStyles } from "../../../../styles/id.styles";
import { CustomHeader } from "../../../../components/HeaderApp";
import { useClienteDetalle, useClienteAlquileres, useDeleteClienteAccion } from "../../../../hooks/useClientes";
import * as ImagePicker from "expo-image-picker";
import { Avatar, IconButton } from "react-native-paper";
import { uploadClienteAvatar } from "../../../../services/clienteService";


export default function ClienteDetalle() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const idS = idStyles(theme);
  const formS = formStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNum = Number(id);

  // PETICIONES 
  const { data: cliente, isLoading: loadingCliente, isError: errorCliente, refetch: refetchCliente } = useClienteDetalle(idNum);
  const { data: alquileres = [], isLoading: loadingAlquileres, refetch: refetchAlquileres } = useClienteAlquileres(idNum);
  const { ejecutarEliminar } = useDeleteClienteAccion(); 
  const [borrando, setBorrando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const handlePickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        setSubiendoImagen(true);
        // Llama al servicio 
        await uploadClienteAvatar(idNum, result.assets[0].uri);
        // Recarga los datos
        refetchCliente(); 
      } catch (e) {
        alert("Error al subir imagen: " + e.message);
      } finally {
        setSubiendoImagen(false);
      }
    }
  };

  const abrirMapa = () => {
    // Comprueba que el cliente tenga dirección
    if (!cliente?.direccion) {
      alert("Este cliente no tiene una dirección registrada.");
      return;
    }

    // Prepara la dirección para la URL
    const direccionCodificada = encodeURIComponent(cliente.direccion);
    
    // URL 
    const url = `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`;

    // Abre la URL
    Linking.openURL(url).catch((err) => 
      console.error("No se pudo abrir el mapa", err)
    );
  };

  useFocusEffect(
    useCallback(() => {
      refetchCliente();
      refetchAlquileres();
    }, [refetchCliente, refetchAlquileres])
  );
  
  // ESTADOS DE CARGA 
  if (loadingCliente || loadingAlquileres) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  if (errorCliente || !cliente) {
    return (
      <View style={commonS.center}>
        <Text>Error al cargar el cliente</Text>
        <SecondaryButton text="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: cliente.nombre,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.primary,
        }}
      />

      <ScrollView style={commonS.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER */}
        <CustomHeader title={cliente.nombre} />

        <View style={[idS.header, { alignItems: 'center', marginTop: 20 }]}>
          <View style={{ position: 'relative' }}> 
            {/* CONTENEDOR DEL BORDE */}
            <View style={{
              borderRadius: 100,
              padding: 3,
              backgroundColor: theme.colors.primary,
            }}>
              {subiendoImagen ? (
                <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, borderRadius: 40 }}>
                </View>
              ) : cliente.avatar_url ? (
                <Avatar.Image 
                  size={80} 
                  source={{ uri: `${cliente.avatar_url}?t=${new Date().getTime()}` }} 
                  style={{ backgroundColor: 'transparent' }} 
                />
              ) : (
                <Avatar.Text 
                  size={80} 
                  label={cliente.nombre.substring(0, 2).toUpperCase()} 
                  labelStyle={{ fontFamily: 'monospace' }}
                />
              )}
            </View>
            
            {/* BOTÓN CÁMARA */}
            <IconButton 
              icon="camera" 
              mode="contained" 
              size={20}
              containerColor={theme.colors.secondary} 
              iconColor={theme.colors.surface}
              onPress={handlePickImage}
              style={{ 
                position: 'absolute', 
                bottom: -5, // Ajustado para que sobresalga un poco
                right: -5, 
                margin: 0, 
                borderWidth: 2, 
                borderColor: theme.colors.surface,
                zIndex: 10
              }}
            />
          </View>

          <Text style={[idS.headerName, { marginTop: 10 }]}>{cliente.nombre}</Text>
        </View>

        {/* INFO */}
        <View style={{padding: 20 }}>
          <Text style={commonS.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>
          <InfoCard label="Email" value={cliente.email} />
          <InfoCard label="Teléfono" value={cliente.telefono} />
          <InfoCard label="Dirección" value={cliente.direccion} icon="map-marker" onIconPress={abrirMapa}/>
        </View>

        {/* PEDIDOS */}
        <View style={{padding: 20}}>
          <Text style={commonS.sectionTitle}>ÚLTIMOS PEDIDOS</Text>

          {alquileres.length === 0 ? (
            <View style={[idS.infoCard, {alignItems: "center"}]}>
              <Text style={idS.emptyPedidosText}>
                Este cliente no tiene alquileres.
              </Text>
            </View>
          ) : (
            alquileres.map((pedido) => (
              <InfoCardPedidos
                codigo={`ALQ-${pedido.id}`}
                estado={(pedido.estado).toUpperCase()}
                fechaInicio={pedido.fecha_inicio}
                fechaFin={pedido.fecha_fin_prevista}
              />
            ))
          )}
        </View>

        {/* BOTONES */}
        <View style={formS.buttons}>

          {/* EDITAR */}
          <PrimaryButton onPress={() => {
              router.push({
                pathname: "/clientes/editar",
                params: { id: cliente.id }
              });
            }} text="Editar Cliente" 
          />

          {/* GESTIONAR ESTADO */}
          <SecondaryButton onPress={() => {
              router.push({
                pathname: "/clientes/modal",
                params: { id: cliente.id, nombre: cliente.nombre }
              });
            }} text="Gestionar Estado" 
          />

          {/* ELIMINAR */}
          <PrimaryButton 
            onPress={async () => {
              const confirmado = confirm("¿Seguro que quieres eliminar este cliente?");
              
              if (confirmado) {
                try {
                  setBorrando(true);
                  await ejecutarEliminar(idNum);
                  router.back();
                } catch (e) {
                  const mensaje = e instanceof Error ? e.message : "No se pudo eliminar";
                  alert(mensaje); 
                } finally {
                  setBorrando(false);
                }
              }
            }} 
            text={borrando ? "Eliminando..." : "Eliminar Cliente"}
            color={theme.colors.error}
          />
        </View>
      </ScrollView>
    </View>
  );
}
