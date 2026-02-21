import { useEffect } from "react";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { View, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClienteFormValues, ClienteSchema } from "../../../../schemas/cliente.schema";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { ControlledTextInput } from "../../../../components/ControlledTextInput";
import { formStyles } from "../../../../styles/form.styles";
import { commonStyles } from "../../../../styles/common.styles";
import { useClienteDetalle, useUpdateClienteAccion } from "../../../../hooks/useClientes";

export default function EditarCliente() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const idNum = Number(id);

  const { ejecutarActualizar } = useUpdateClienteAccion();
  const { data: cliente, isLoading } = useClienteDetalle(idNum);

  const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: { nombre: "", email: "", telefono: "", direccion: "" },
  });

  // Sincroniza los datos del cliente con el formulario
  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre,
        email: cliente.email ?? "",
        telefono: cliente.telefono ?? "",
        direccion: cliente.direccion ?? "",
      });
    }
  }, [cliente, reset]);

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      await ejecutarActualizar(idNum, {
        ...cliente, 
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion
      });

      Alert.alert("Éxito", `Cliente "${data.nombre}" actualizado correctamente`);
      router.back();
    } catch (error) {

      if (error.message.includes("registrado") || error.message.includes("email")) {
        setError("email", { type: "manual", message: error.message });
      } else {
        // Si es otro tipo de error
        Alert.alert("Error", error.message);
      }
      
      console.log("Error. No se pudo actualizar", error)
    }
  };

  if (isLoading) {
    return (
      <View style={commonStyles(theme).center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={[commonS.screen, {padding: 20, justifyContent: "center"}]}>
      <View style={formS.container}>
        <Text style={[commonS.sectionTitle, {textAlign: "center",}]}>Editar Cliente</Text>

        {/* -------- NOMBRE -------- */}
        <ControlledTextInput
          control={control}
          name="nombre"
          placeholder="Nombre"
          errors={errors}
        />

        {/* -------- EMAIL -------- */}
        <ControlledTextInput
          control={control}
          name="email"
          placeholder="Email"
          errors={errors}
        />

        {/* -------- TELÉFONO -------- */}
        <ControlledTextInput
          control={control}
          name="telefono"
          placeholder="Teléfono"
          errors={errors}
        />

        {/* -------- DIRECCIÓN -------- */}
        <ControlledTextInput
          control={control}
          name="direccion"
          placeholder="Dirección"
          errors={errors}
        />

        {/* -------- BOTONES -------- */}
        <View style={formS.buttons}>
          <PrimaryButton onPress={handleSubmit(onSubmit)} text="Guardar Cambios" />
          <SecondaryButton onPress={() => router.back()} text="Cancelar" />
        </View>
      </View>
    </ScrollView>
  );
}
