import { View, Text, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { actualizarCliente } from "../../../services/clienteService";
import { modalStyles } from "../../../styles/modal.styles";
import { commonStyles } from "../../../styles/common.styles";

export default function ClienteModal() {
  const { id, nombre } = useLocalSearchParams();
  const router = useRouter();

  const handleUpdate = async (activo: boolean) => {
    await actualizarCliente(Number(id), { activo });
    router.back();
  };

  return (
    <View style={[commonStyles.screen, {justifyContent: "center", padding: 20}]}>
      <View style={modalStyles.containerModal}>

        {/* TÍTULO */}
        <Text style={[commonStyles.sectionTitle, {textAlign: "center"}]}>GESTIONAR CLIENTE</Text>
        <Text style={modalStyles.nameUser}>{nombre}</Text>

        {/* DESCRIPCIÓN */}
        <Text style={modalStyles.description}>
          Selecciona el nuevo estado para este cliente
        </Text>

        {/* BOTÓN ACTIVO */}
        <Pressable
          style={[modalStyles.button, modalStyles.buttonSuccess]}
          onPress={() => handleUpdate(true)}
        >
          <View style={commonStyles.row}>
            <Text style={modalStyles.buttonText}>MARCAR COMO ACTIVO</Text>
          </View>
        </Pressable>

        {/* BOTÓN INACTIVO */}
        <Pressable
          style={[modalStyles.button, modalStyles.buttonError]}
          onPress={() => handleUpdate(false)}
        >
          <View style={commonStyles.row}>
            <Text style={modalStyles.buttonText}>MARCAR COMO INACTIVO</Text>
          </View>
        </Pressable>

        {/* CANCELAR */}
        <Pressable onPress={() => router.back()}>
          <Text style={[commonStyles.labelColor, {marginTop: 16}]}>Cancelar</Text>
        </Pressable>

      </View>
    </View>
  );
}
