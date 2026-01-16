import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { obtenerClientes } from "../../../services/clienteService";
import { Cliente } from "../../../types/mockApi";
import theme from "../../../theme";

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>
          Cargando clientes...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>LISTA DE CLIENTES</Text>
          <Text style={styles.headerSubtitle}>
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} registrado{clientesFiltrados.length !== 1 ? "s" : ""}
          </Text>
        </View>
        
      <View style={styles.container}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar cliente..."
          placeholderTextColor={theme.colors.placeholder}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/clientes/${item.id}`} asChild>
              <Pressable style={styles.card}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: item.activo
                        ? theme.colors.primary
                        : theme.colors.secondary,
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {item.nombre.charAt(0)}
                  </Text>
                </View>

                <View>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text style={styles.sub}>{item.email ?? "Sin email"}</Text>
                  <Text style={styles.sub}>{item.telefono ?? "Sin teléfono"}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />

        <Link href="/clientes/nuevo" asChild>
          <Pressable style={styles.foto}>
            <Text style={styles.fotoText}>+</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  container: { 
    flex: 1, 
    padding: 10 
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.inputText,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  buscador: {
    backgroundColor: theme.colors.backgroundCard,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: theme.colors.text,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.outline,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: { 
    color: theme.colors.onPrimary,
    fontWeight: "bold", 
    fontSize: 18,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  nombre: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  sub: { 
    color: theme.colors.inputText,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  foto: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  fotoText: {
    color: theme.colors.surface,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -4,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
});
