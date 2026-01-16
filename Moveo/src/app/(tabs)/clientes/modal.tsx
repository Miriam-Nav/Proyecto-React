import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { actualizarCliente } from "../../../services/clienteService";
import theme from "../../../theme";

export default function ClienteModal() {
  const { id, nombre } = useLocalSearchParams();
  const router = useRouter();

  const handleUpdate = async (activo: boolean) => {
    await actualizarCliente(Number(id), { activo });
    router.back();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.box}>

        {/* TÍTULO */}
        <Text style={styles.title}>GESTIONAR CLIENTE</Text>
        <Text style={styles.name}>{nombre}</Text>

        {/* DESCRIPCIÓN */}
        <Text style={styles.description}>
          Selecciona el nuevo estado para este cliente
        </Text>

        {/* BOTÓN ACTIVO */}
        <Pressable
          style={[styles.button, styles.buttonSuccess]}
          onPress={() => handleUpdate(true)}
        >
          <View style={styles.row}>
            <Text style={styles.buttonText}>MARCAR COMO ACTIVO</Text>
          </View>
        </Pressable>

        {/* BOTÓN INACTIVO */}
        <Pressable
          style={[styles.button, styles.buttonError]}
          onPress={() => handleUpdate(false)}
        >
          <View style={styles.row}>
            <Text style={styles.buttonText}>MARCAR COMO INACTIVO</Text>
          </View>
        </Pressable>

        {/* CANCELAR */}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancelar</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: 20,
  },

  box: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 3,
    borderColor: theme.colors.outline,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },

  description: {
    fontSize: 14,
    fontFamily: "monospace",
    color: theme.colors.inputText,
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 3,
    marginBottom: 12,
  },

  buttonSuccess: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
  },

  buttonError: {
    backgroundColor: theme.colors.errorSoft,
    borderColor: theme.colors.error,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "monospace",
    color: theme.colors.text,
  },

  cancel: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.secondary,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 14,
  },
});
