import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  useLocalSearchParams,
  Stack,
  useFocusEffect,
  router,
} from "expo-router";
import { useTheme } from "react-native-paper";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { InfoCard, InfoCardPedidos } from "../../../../components/CardApp";
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { idStyles } from "../../../../styles/id.styles";
import { CustomHeader } from "../../../../components/HeaderApp";
import { useClienteDetalle, useClienteAlquileres, useDeleteClienteAccion } from "../../../../hooks/useClientes";

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
        <CustomHeader title={cliente.nombre}></CustomHeader>
        <View style={idS.header}>
          <View style={idS.avatar}>
            <Text style={idS.avatarText}>
              {cliente.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={idS.headerName}>{cliente.nombre}</Text>

          <View
            style={[
              idS.statusBadge,
              {
                backgroundColor: cliente.activo
                  ? theme.colors.onError
                  : theme.colors.error,
              },
            ]}
          >
            <Text style={idS.statusBadgeText}>
              {cliente.activo ? "ACTIVO" : "INACTIVO"}
            </Text>
          </View>
        </View>

        {/* INFO */}
        <View style={{padding: 20 }}>
          <Text style={commonS.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>
          <InfoCard label="Email" value={cliente.email} />
          <InfoCard label="Teléfono" value={cliente.telefono} />
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
