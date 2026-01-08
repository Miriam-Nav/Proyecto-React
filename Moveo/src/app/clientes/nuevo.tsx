import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearCliente } from "../../services/clienteService";
import { ClienteFormValues, ClienteSchema } from "../../schemas/auth.schema";
import theme from "../../theme";

export default function NuevoCliente() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    // Zod valida el formulario
    resolver: zodResolver(ClienteSchema),

    // Valores iniciales del formulario
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    },

    mode: "onBlur",
  });


  // Crea el cliente
  const onSubmit =  async (data: ClienteFormValues) => {
    await crearCliente({
          id: Date.now(),
          nombre: data.nombre,
          email: data.email || "",
          telefono: data.telefono || "",
          activo: true,
        });
    router.back(); 
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Nuevo Cliente</Text>

        {/* -------- NOMBRE -------- */}
        <Controller
          control={control} 
          name="nombre"     
          render={({ field }) => (
            <TextInput
              style={[ 
                styles.input,
                // Si hay error pone borde rojo
                errors.nombre ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Nombre"
              value={field.value} 
              onChangeText={field.onChange} 
              onBlur={field.onBlur} 
            />
          )}
        />
        {/* Mensaje de error */}
        {errors.nombre && (
          <Text style={styles.error}>{errors.nombre.message}</Text>
        )}

        {/* -------- EMAIL -------- */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              style={[
                styles.input,
                errors.email ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* -------- TELÉFONO -------- */}
        <Controller
          control={control}
          name="telefono"
          render={({ field }) => (
            <TextInput
              style={[
                styles.input,
                errors.telefono ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Teléfono"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.telefono && (
          <Text style={styles.error}>{errors.telefono.message}</Text>
        )}

        {/* -------- BOTONES -------- */}
        <View style={styles.buttons}>
          {/* handleSubmit valida con Zod y luego ejecuta onSubmit */}
          <Pressable style={styles.btnPrimary} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.btnText}>Crear Cliente</Text>
          </Pressable>

          <Pressable style={styles.btnSecondary} onPress={() => router.back()}>
            <Text style={[styles.btnText, { color: theme.colors.primary }]}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 10,
  },

  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    margin: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "monospace",
    color: theme.colors.text,
    textAlign: "center",
  },

  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontFamily: "monospace",
    color: theme.colors.text,
    fontSize: 16,
  },

  error: {
    color: theme.colors.error,
    fontFamily: "monospace",
    marginBottom: 10,
  },

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

  btnText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: 16,
  },
});
