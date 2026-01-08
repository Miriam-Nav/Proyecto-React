import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import {
  useLocalSearchParams,
  Stack,
  Link,
  useFocusEffect,
  router,
} from "expo-router";
import {
  eliminarCliente,
  obtenerClientePorId,
  obtenerPedidosPorCliente,
} from "../../services/clienteService";
import { Cliente, Pedido } from "../../types/mockApi";
import theme from "../../theme";

export default function ClienteDetalle() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pedidosCliente, setPedidosCliente] = useState<Pedido[]>([]);

  const cargarDetalle = useCallback(async () => {
    const idNum = Number(Array.isArray(id) ? id[0] : id);
    if (!idNum) return;

    setCargando(true);
    const data = await obtenerClientePorId(idNum);
    setCliente(data ?? null);

    const pedidos = await obtenerPedidosPorCliente(idNum);
    setPedidosCliente(pedidos);

    setCargando(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      cargarDetalle();
    }, [cargarDetalle])
  );

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.center}>
        <Text>Cliente no encontrado</Text>
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

      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {cliente.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.headerName}>{cliente.nombre}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: cliente.activo
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {cliente.activo ? "ACTIVO" : "INACTIVO"}
            </Text>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {cliente.email ?? "No registrado"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>
              {cliente.telefono ?? "No registrado"}
            </Text>
          </View>
        </View>

        {/* PEDIDOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÚLTIMOS PEDIDOS</Text>

          {pedidosCliente.length === 0 ? (
            <View style={styles.emptyPedidos}>
              <Text style={styles.emptyPedidosText}>
                Este cliente no tiene pedidos.
              </Text>
            </View>
          ) : (
            pedidosCliente.map((pedido) => (
              <View key={pedido.id} style={styles.pedidoCard}>
                <View style={styles.pedidoHeader}>
                  <Text style={styles.pedidoCodigo}>{pedido.codigo}</Text>

                  <View style={styles.pedidoEstadoBadge}>
                    <Text style={styles.pedidoEstadoText}>{pedido.estado}</Text>
                  </View>
                </View>

                <Text style={styles.pedidoFecha}>{pedido.fechaInicio} - {pedido.fechaFin} </Text>
              </View>
            ))
          )}
        </View>

        {/* BOTONES */}
        <View style={styles.buttons}>
          <Link
            href={{ 
              pathname: "/clientes/editar", 
              params: { id: cliente.id } 
            }}
            asChild
          >
            <Pressable style={styles.btnPrimary}>
              <Text style={styles.btnText}>Editar Cliente</Text>
            </Pressable>
          </Link>

          <Link
            href={{
              pathname: "/clientes/modal",
              params: { id: cliente.id, nombre: cliente.nombre },
            }}
            asChild
          >
            <Pressable style={styles.btnSecondary}>
              <Text style={[styles.btnText, { color: theme.colors.primary }]}>
                Gestionar Estado
              </Text>
            </Pressable>
          </Link>

          <Pressable style={styles.btnDanger}
              onPress={async () => {
                  const confirmar = confirm("¿Seguro que quieres eliminar este cliente?");
                  if (!confirmar) return;

                  await eliminarCliente(cliente.id);
                  router.replace("/(tabs)/clientes");
              }}
              >
              <Text style={styles.actionText}>Eliminar Cliente</Text>
            </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------------- ESTILOS ---------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /* LOADING */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "monospace",
    color: theme.colors.text,
  },

  /* HEADER */
  header: {
    alignItems: "center",
    padding: 40,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.outline,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: theme.colors.outline,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.onPrimary,
    fontFamily: "monospace",
  },
  headerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
  },

  /* SECTIONS */
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    fontFamily: "monospace",
    marginBottom: 15,
  },

  /* INFO CARDS */
  infoCard: {
    flexDirection: "column",
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    paddingBottom: 5,
    color: theme.colors.placeholder,
    fontFamily: "monospace",
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "monospace",
    fontWeight: "600",
  },

  /* PEDIDOS */
  emptyPedidos: {
    padding: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    alignItems: "center",
  },
  emptyPedidosText: {
    color: theme.colors.placeholder,
    fontFamily: "monospace",
  },

  pedidoCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    marginBottom: 12,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  pedidoCodigo: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.text,
  },
  pedidoEstadoBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
  },
  pedidoEstadoText: {
    color: theme.colors.onSecondary,
    fontWeight: "bold",
    fontSize: 11,
    fontFamily: "monospace",
  },
  pedidoFecha: {
    fontSize: 13,
    color: theme.colors.inputText,
    fontFamily: "monospace",
  },

  /* ACTION BUTTONS */
  actionText: { color: theme.colors.onPrimary, fontWeight: "bold" },
  
  buttons: {
    flexDirection: "row",
    alignItems: "center",   
    paddingHorizontal: 10,
    marginTop: 20,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",   
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",   
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  btnDanger: {
    flex: 1,
    backgroundColor: theme.colors.error,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",   
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.error,
  },
  btnText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
