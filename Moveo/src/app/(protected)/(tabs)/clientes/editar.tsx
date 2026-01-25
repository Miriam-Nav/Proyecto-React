import { useEffect, useState } from "react";
import { ActivityIndicator, MD3Theme, Text, useTheme } from "react-native-paper";
import { View, ScrollView} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClienteFormValues, ClienteSchema } from "../../../../schemas/cliente.schema";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { ControlledTextInput } from "../../../../components/ControlledTextInput";
import { actualizarCliente, obtenerClientePorId } from "../../../../services/clienteService";
import { formStyles } from "../../../../styles/form.styles";
import { commonStyles } from "../../../../styles/common.styles";

export default function EditarCliente() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

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
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
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

        {/* -------- BOTONES -------- */}
        <View style={formS.buttons}>
          <PrimaryButton onPress={handleSubmit(onSubmit)} text="Guardar Cambios" />
          <SecondaryButton onPress={() => router.back()} text="Cancelar" />
        </View>
      </View>
    </ScrollView>
  );
}
