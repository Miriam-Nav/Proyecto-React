import { View, Text } from "react-native";
import { idStyles } from "../styles/id.styles";
import { useTheme } from "react-native-paper";


type Props = {
  label: string;
  value?: string | null;
};

export function InfoCard({ label, value }: Props) {
  const theme = useTheme();
  const idS = idStyles(theme);
  
  return (
    <View style={idS.infoCard}>
      <Text style={idS.infoLabel}>{label}</Text>
      <Text style={idS.infoValue}>{value ?? "No registrado"}</Text>
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
