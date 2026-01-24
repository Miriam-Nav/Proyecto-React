import { useCallback, useState } from "react";
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
import { PrimaryButton, SecondaryButton } from "../../../components/ButtonApp";
import { InfoCard, InfoCardPedidos } from "../../../components/CardApp";
import { obtenerClientePorId, obtenerPedidosPorCliente, eliminarCliente } from "../../../services/clienteService";
import { commonStyles } from "../../../styles/common.styles";
import { formStyles } from "../../../styles/form.styles";
import { idStyles } from "../../../styles/id.styles";
import { themeApp } from "../../../theme";
import { Cliente, Pedido } from "../../../types/mockApi";

export default function ClienteDetalle() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const idS = idStyles(theme);
  const formS = formStyles(theme);

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
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={themeApp.colors.primary} />
        <Text style={commonS.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={commonS.center}>
        <Text>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: cliente.nombre,
          headerStyle: { backgroundColor: themeApp.colors.surface },
          headerTintColor: themeApp.colors.primary,
        }}
      />

      <ScrollView style={commonS.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
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
                  ? themeApp.colors.success
                  : themeApp.colors.error,
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

          {pedidosCliente.length === 0 ? (
            <View style={[idS.infoCard, {alignItems: "center"}]}>
              <Text style={idS.emptyPedidosText}>
                Este cliente no tiene pedidos.
              </Text>
            </View>
          ) : (
            pedidosCliente.map((pedido) => (
              <InfoCardPedidos
                codigo={pedido.codigo}
                estado={pedido.estado}
                fechaInicio={pedido.fechaInicio}
                fechaFin={pedido.fechaFin}
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
          <PrimaryButton onPress={async () => {
              const confirmar = confirm("¿Seguro que quieres eliminar este cliente?");
              if (!confirmar) return;
              await eliminarCliente(cliente.id);
              router.back();
            }} 
            text="Eliminar Cliente"
            color={themeApp.colors.error}
          />
        </View>
      </ScrollView>
    </View>
  );
}
