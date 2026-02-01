import { View, Text, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { commonStyles } from "../../../../styles/common.styles";
import { idStyles } from "../../../../styles/id.styles";
import { modalStyles } from "../../../../styles/modal.styles";
import { useState } from "react";
import { useUpdateEstadoCliente } from "../../../../hooks/useClientes";

export default function ClienteModal() {
  const { id, nombre } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const modalS = modalStyles(theme);
  const idS = idStyles(theme);

  const [cargando, setCargando] = useState(false);
  const { ejecutarCambioEstado } = useUpdateEstadoCliente();
  const handleUpdate = async (nuevoEstado: boolean) => {
    try {
      setCargando(true);
      await ejecutarCambioEstado(Number(id), nuevoEstado);
      router.back();
    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false);
    }
  };

  const inicial = typeof nombre === "string" ? nombre.charAt(0).toUpperCase() : "?";
  return (
    <View style={[commonS.screen, { justifyContent: "center", padding: 20 }]}>
      <View style={modalS.containerModal}>

        {/* ICONO CIRCULAR */}
        <View style={idS.avatar}>
          <Text style={idS.avatarText}>{inicial}</Text>
        </View>

        {/* NOMBRE DEL CLIENTE */}
        <Text style={modalS.nameUser}>{nombre}</Text>

        {/* DESCRIPCIÓN */}
        <Text style={modalS.description}>
          Selecciona el nuevo estado
        </Text>

        <View style={{ width: "100%", gap: 12 }}>
          <PrimaryButton 
            onPress={() => handleUpdate(true)} 
            text="MARCAR COMO ACTIVO" 
            color={theme.colors.onError}
          />

          <SecondaryButton 
            onPress={() => handleUpdate(false)} 
            text="MARCAR COMO INACTIVO" 
            color={theme.colors.error}
          />
        </View>


        {/* CANCELAR */}
        <Pressable onPress={() => router.back()}>
          <Text style={[commonS.labelColor, { marginTop: 30 }]}>Cancelar</Text>
        </Pressable>

      </View>
    </View>
  );
}
