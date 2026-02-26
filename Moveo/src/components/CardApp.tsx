import { View, Text } from "react-native";
import { idStyles } from "../styles/id.styles";
import { IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";


type Props = {
  label: string;
  value?: string | null;
  icon?: string;
  onIconPress?: () => void;
};

export function InfoCard({ label, value, icon, onIconPress }: Props) {
  const theme = useTheme();
  const idS = idStyles(theme);
  
  return (
    <View style={[
      idS.infoCard, 
      // Si hay icono cambia el diseño a fila para alinearlo
      icon ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } : {}
    ]}>
      <View style={icon ? { flex: 1, paddingRight: 10 } : {}}>
        <Text style={idS.infoLabel}>{label}</Text>
        <Text style={idS.infoValue}>{value ?? "No registrado"}</Text>
      </View>

      {/* Solo aparece se pasa un icono */}
      {icon && onIconPress && (
        <IconButton
          icon={icon}
          mode="contained-tonal"
          size={24}
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.primary}
          onPress={onIconPress}
          style={{ margin: 0 }}
        />
      )}
    </View>
  );
}

type PropsAlquiler = {
  id: number;
  tituloVideojuego: string;
  nombreCliente: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  monto?: number;
};

export function InfoCardAlquiler({ 
  id,
  tituloVideojuego, 
  nombreCliente, 
  fechaInicio, 
  fechaFin, 
  estado,
  monto 
}: PropsAlquiler) {
  const theme = useTheme();
  const router = useRouter();
  const idS = idStyles(theme);

  const handleEditar = () => {
    router.push(`/alquileres/${id}`);
  };

  // Función para determinar el color del badge según el estado
  const getEstadoColor = (est: string) => {
    switch (est.toLowerCase()) {
      case 'activo': return theme.colors.primary;
      case 'finalizado': return theme.colors.tertiary;
      case 'retrasado': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };
  
  return (
    <View style={[
      idS.infoCard, 
      { 
        borderWidth: 1, 
        borderColor: theme.colors.outlineVariant, 
        marginBottom: 12 
      }
    ]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontFamily: "monospace", 
            fontWeight: "bold", 
            fontSize: 14, 
            color: theme.colors.onSurface 
          }}>
            {tituloVideojuego}
          </Text>
          
          <Text style={{ 
            fontFamily: "monospace", 
            fontSize: 12, 
            color: theme.colors.onSurfaceVariant,
            marginTop: 2
          }}>
            Cliente: {nombreCliente}
          </Text>
          
          <Text style={{ 
            fontFamily: "monospace", 
            fontSize: 11, 
            color: theme.colors.onSurfaceVariant,
            marginTop: 2
          }}>
            {fechaInicio} - {fechaFin}
          </Text>

          {monto !== undefined && (
            <Text style={{ 
              fontFamily: "monospace", 
              fontSize: 13, 
              fontWeight: 'bold', 
              color: theme.colors.primary,
              marginTop: 6
            }}>
              ${monto.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Badge de Estado y Botones */}
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: getEstadoColor(estado),
            marginBottom: 4,
          }}>
            <Text style={{
              color: theme.colors.surface,
              fontWeight: 'bold',
              fontSize: 10,
              fontFamily: 'monospace',
            }}>
              {estado.toUpperCase()}
            </Text>
          </View>

          {/* Botón Editar */}
          <IconButton
            icon="pencil"
            size={18}
            mode="contained"
            containerColor={theme.colors.outlineVariant}
            iconColor={theme.colors.onTertiary}
            onPress={handleEditar}
          />
        </View>
      </View>
    </View>
  );
}


type PropsPedidos = {
  codigo: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
};

export function InfoCardPedidos({ codigo, estado, fechaInicio, fechaFin }: PropsPedidos) {
  const theme = useTheme();
  const idS = idStyles(theme);
  
  return (
    <View style={idS.infoCard}>
      <View style={idS.pedidoHeader}>
        <Text style={idS.pedidoCodigo}>{codigo}</Text>
        <View style={idS.pedidoEstadoBadge}>
          <Text style={idS.pedidoEstadoText}>{estado}</Text>
        </View>
      </View>
      <Text style={idS.pedidoFecha}>
        {fechaInicio} - {fechaFin}
      </Text>
    </View>
  );
}
