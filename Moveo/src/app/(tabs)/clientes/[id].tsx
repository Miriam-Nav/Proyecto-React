import { useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import {
  useLocalSearchParams,
  Stack,
  useFocusEffect,
  router,
} from "expo-router";
import {
  eliminarCliente,
  obtenerClientePorId,
  obtenerPedidosPorCliente,
} from "../../../services/clienteService";
import { Cliente, Pedido } from "../../../types/mockApi";
import theme from "../../../theme";
import { idStyles } from "../../../styles/id.styles";
import { commonStyles } from "../../../styles/common.styles";
import { formStyles } from "../../../styles/form.styles";

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
      <View style={commonStyles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonStyles.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={commonStyles.center}>
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

      <ScrollView style={commonStyles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View style={idStyles.header}>
          <View style={idStyles.avatar}>
            <Text style={idStyles.avatarText}>
              {cliente.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={idStyles.headerName}>{cliente.nombre}</Text>

          <View
            style={[
              idStyles.statusBadge,
              {
                backgroundColor: cliente.activo
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          >
            <Text style={idStyles.statusBadgeText}>
              {cliente.activo ? "ACTIVO" : "INACTIVO"}
            </Text>
          </View>
        </View>

        {/* INFO */}
        <View style={{padding: 20 }}>
          <Text style={commonStyles.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>

          <View style={idStyles.infoCard}>
            <Text style={idStyles.infoLabel}>Email</Text>
            <Text style={idStyles.infoValue}>
              {cliente.email ?? "No registrado"}
            </Text>
          </View>

          <View style={idStyles.infoCard}>
            <Text style={idStyles.infoLabel}>Teléfono</Text>
            <Text style={idStyles.infoValue}>
              {cliente.telefono ?? "No registrado"}
            </Text>
          </View>
        </View>

        {/* PEDIDOS */}
        <View style={{padding: 20}}>
          <Text style={commonStyles.sectionTitle}>ÚLTIMOS PEDIDOS</Text>

          {pedidosCliente.length === 0 ? (
            <View style={[idStyles.infoCard, {alignItems: "center"}]}>
              <Text style={idStyles.emptyPedidosText}>
                Este cliente no tiene pedidos.
              </Text>
            </View>
          ) : (
            pedidosCliente.map((pedido) => (
              <View key={pedido.id} style={idStyles.infoCard}>
                <View style={idStyles.pedidoHeader}>
                  <Text style={idStyles.pedidoCodigo}>{pedido.codigo}</Text>

                  <View style={idStyles.pedidoEstadoBadge}>
                    <Text style={idStyles.pedidoEstadoText}>{pedido.estado}</Text>
                  </View>
                </View>

                <Text style={idStyles.pedidoFecha}>{pedido.fechaInicio} - {pedido.fechaFin} </Text>
              </View>
            ))
          )}
        </View>

        {/* BOTONES */}
        <View style={formStyles.buttons}>

          {/* EDITAR */}
          <Pressable
            style={formStyles.btnPrimary}
            onPress={() => {
              router.push({
                pathname: "/clientes/editar",
                params: { id: cliente.id }
              });
            }}
          >
            <Text style={formStyles.btnText}>Editar Cliente</Text>
          </Pressable>

          {/* GESTIONAR ESTADO */}
          <Pressable
            style={formStyles.btnSecondary}
            onPress={() => {
              router.push({
                pathname: "/clientes/modal",
                params: { id: cliente.id, nombre: cliente.nombre }
              });
            }}
          >
            <Text style={[formStyles.btnText, { color: theme.colors.primary }]}>
              Gestionar Estado
            </Text>
          </Pressable>

          {/* ELIMINAR */}
          <Pressable
            style={formStyles.btnDanger}
            onPress={async () => {
              const confirmar = confirm("¿Seguro que quieres eliminar este cliente?");
              if (!confirmar) return;

              await eliminarCliente(cliente.id);
              router.back();
            }}
          >
            <Text style={formStyles.actionText}>Eliminar Cliente</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}
