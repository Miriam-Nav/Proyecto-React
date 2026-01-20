import { useCallback, useEffect, useState } from "react";
import { Text, TextInput } from "react-native-paper";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { obtenerClientes } from "../../../services/clienteService";
import { Cliente } from "../../../types/mockApi";
import theme from "../../../theme";
import { clientStyles } from "../../../styles/client.styles";
import { commonStyles } from "../../../styles/common.styles";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

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


  if (cargando) {
    return (
      <View style={commonStyles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>
          Cargando clientes...
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>LISTA DE CLIENTES</Text>
        <Text style={commonStyles.headerSubtitle}>
          {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} registrado{clientesFiltrados.length !== 1 ? "s" : ""}
        </Text>
      </View>
        
      <View style={{flex: 1, padding: 10 }}>
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          mode="outlined"
          placeholder="Buscar cliente..."
          placeholderTextColor={theme.colors.placeholder}
          style={clientStyles.buscador}
          outlineStyle={clientStyles.inputOutline}
          contentStyle={clientStyles.inputContent}
          
        />

        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/clientes/${item.id}`} asChild>
              <Pressable style={clientStyles.card}>
                <View
                  style={[
                    clientStyles.avatar,
                    {
                      backgroundColor: item.activo
                        ? theme.colors.primary
                        : theme.colors.secondary,
                    },
                  ]}
                >
                  <Text style={clientStyles.avatarText}>
                    {item.nombre.charAt(0)}
                  </Text>
                </View>

                <View>
                  <Text style={clientStyles.name}>{item.nombre}</Text>
                  <Text style={clientStyles.datos}>{item.email ?? "Sin email"}</Text>
                  <Text style={clientStyles.datos}>{item.telefono ?? "Sin teléfono"}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />

        <Link href="/clientes/nuevo" asChild>
          <Pressable style={clientStyles.add}>
            <Text style={clientStyles.addText}>+</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
