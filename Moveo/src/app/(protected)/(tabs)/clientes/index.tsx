import { useCallback, useMemo, useState } from "react";
import { Text, TextInput, useTheme, ActivityIndicator } from "react-native-paper";
import { View, FlatList, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { clientStyles } from "../../../../styles/client.styles";
import { commonStyles } from "../../../../styles/common.styles";
import { useClientes } from "../../../../hooks/useClientes";

export default function ClientesScreen() {
  const [busqueda, setBusqueda] = useState("");
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const clientS = clientStyles(theme);

  const { 
    data: clientes = [], 
    isLoading, 
    isError, 
    refetch 
  } = useClientes();

  // Refrescar cuando la pantalla gana el foco 
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // FILTRADO
  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return clientes.filter((c) => c.nombre.toLowerCase().includes(texto));
  }, [clientes, busqueda]);


  // MANEJO DE ESTADOS
  if (isLoading) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10 }}>Cargando clientes de Supabase...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={commonS.center}>
        <Text>Error al conectar con el servidor.</Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: theme.colors.primary }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={commonS.screen}>
      <View style={commonS.header}>
        <Text style={commonS.headerTitle}>LISTA DE CLIENTES</Text>
        <Text style={commonS.headerSubtitle}>
          {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} registrado{clientesFiltrados.length !== 1 ? "s" : ""}
        </Text>
      </View>
        
      <View style={{flex: 1, padding: 10 }}>
        {/* BARRA DE BUSQUEDA */}
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          mode="outlined"
          placeholder="Buscar cliente..."
          placeholderTextColor={theme.colors.outline}
          style={clientS.buscador}
          outlineStyle={clientS.inputOutline}
          contentStyle={clientS.inputContent}
        />

        {/* CLIENTES */}
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/clientes/${item.id}`} asChild>
              <Pressable style={clientS.card}>
                <View
                  style={[
                    clientS.avatar,
                    {
                      backgroundColor: item.activo
                        ? theme.colors.primary
                        : theme.colors.secondary,
                    },
                  ]}
                >
                  <Text style={clientS.avatarText}>
                    {item.nombre.charAt(0)}
                  </Text>
                </View>

                <View>
                  <Text style={clientS.name}>{item.nombre}</Text>
                  <Text style={clientS.datos}>{item.email ?? "Sin email"}</Text>
                  <Text style={clientS.datos}>{item.telefono ?? "Sin teléfono"}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />

        {/* BOTON CREAR CLIENTE */}
        <Link href="/clientes/nuevo" asChild>
          <Pressable style={clientS.add}>
            <Text style={clientS.addText}>+</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
