import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, useTheme } from "react-native-paper";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { obtenerClientes } from "../../../../services/clienteService";
import { clientStyles } from "../../../../styles/client.styles";
import { commonStyles } from "../../../../styles/common.styles";
import { Cliente } from "../../../../types/mockApi";


export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const theme = useTheme();
  const commonS = commonStyles(theme);
  const clientS = clientStyles(theme);


  useEffect(() => {
    cargarDatos();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      cargarDatos();   
    }, [])
  );


  const cargarDatos = async () => {
    try {
      setCargando(true); 
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes", error);
    } finally {
      setCargando(false);
    }
  };

  const clientesFiltrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(texto)
    );
  });


  // COMPRUEBA QUE LOS CLIENTES HAN CARGADO
  if (cargando) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>
          Cargando clientes...
        </Text>
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
