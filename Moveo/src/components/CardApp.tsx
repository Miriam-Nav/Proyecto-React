import { View, Text } from "react-native";
import { idStyles } from "../styles/id.styles";
import { IconButton, useTheme } from "react-native-paper";


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
