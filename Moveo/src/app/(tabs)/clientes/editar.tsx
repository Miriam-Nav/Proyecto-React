import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import {
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClienteFormValues, ClienteSchema } from "../../../schemas/cliente.schema";
import theme from "../../../theme";
import { formStyles } from "../../../styles/form.styles";
import { commonStyles } from "../../../styles/common.styles";
import { actualizarCliente, obtenerClientePorId } from "../../../services/clienteService";

export default function EditarCliente() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    },
    mode: "onBlur",
  });

  // Cargar datos del cliente
  useEffect(() => {
    const cargar = async () => {
      const idNum = Number(Array.isArray(id) ? id[0] : id);
      const data = await obtenerClientePorId(idNum);

      if (data) {
        setValue("nombre", data.nombre);
        setValue("email", data.email ?? "");
        setValue("telefono", data.telefono ?? "");
      }

      setCargando(false);
    };

    cargar();
  }, [id]);

  // Guardar cambios
  const onSubmit = async (data: ClienteFormValues) => {
    const idNum = Number(Array.isArray(id) ? id[0] : id);

    await actualizarCliente(idNum, {
      nombre: data.nombre,
      email: data.email || "",
      telefono: data.telefono || "",
    });

    router.back();
  };

  if (cargando) {
    return (
      <View style={commonStyles.center}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[commonStyles.screen, {padding: 20, justifyContent: "center"}]}>
      <View style={formStyles.container}>
        <Text style={[commonStyles.sectionTitle, {textAlign: "center",}]}>Editar Cliente</Text>

        {/* -------- NOMBRE -------- */}
        <Controller
          control={control}
          name="nombre"
          render={({ field }) => (
            <TextInput
              style={[
                formStyles.input,
                errors.nombre ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Nombre"
              placeholderTextColor={theme.colors.placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              outlineStyle={formStyles.inputOutline}
              contentStyle={formStyles.inputContent}
              mode="outlined"
            />
          )}
        />
        {errors.nombre && (
          <Text style={formStyles.error}>{errors.nombre.message}</Text>
        )}

        {/* -------- EMAIL -------- */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              style={[
                formStyles.input,
                errors.email ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Email"
              placeholderTextColor={theme.colors.placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              outlineStyle={formStyles.inputOutline}
              contentStyle={formStyles.inputContent}
              mode="outlined"
            />
          )}
        />
        {errors.email && (
          <Text style={formStyles.error}>{errors.email.message}</Text>
        )}

        {/* -------- TELÉFONO -------- */}
        <Controller
          control={control}
          name="telefono"
          render={({ field }) => (
            <TextInput
              style={[
                formStyles.input,
                errors.telefono ? { borderColor: theme.colors.error } : null,
              ]}
              placeholder="Teléfono"
              placeholderTextColor={theme.colors.placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="phone-pad"
              outlineStyle={formStyles.inputOutline}
              contentStyle={formStyles.inputContent}
              mode="outlined"
            />
          )}
        />
        {errors.telefono && (
          <Text style={formStyles.error}>{errors.telefono.message}</Text>
        )}

        {/* -------- BOTONES -------- */}
        <View style={formStyles.buttons}>
          <Pressable style={formStyles.btnPrimary} onPress={handleSubmit(onSubmit)}>
            <Text style={formStyles.btnText}>Guardar Cambios</Text>
          </Pressable>

          <Pressable style={formStyles.btnSecondary} onPress={() => router.back()}>
            <Text style={[formStyles.btnText, { color: theme.colors.primary }]}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
