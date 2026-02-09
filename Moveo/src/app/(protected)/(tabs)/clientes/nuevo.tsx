import { Text, useTheme } from "react-native-paper";
import { View, ScrollView} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { ControlledTextInput } from "../../../../components/ControlledTextInput";
import { ClienteFormValues, ClienteSchema } from "../../../../schemas/cliente.schema";
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { useNuevoClienteAccion } from "../../../../hooks/useClientes";
import { useState } from "react";


export default function NuevoCliente() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

  const { ejecutarCrear } = useNuevoClienteAccion();
  const [cargando, setCargando] = useState(false);

  const { control, handleSubmit, setError, formState: { errors } } = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: { nombre: "", email: "", telefono: "", direccion: "" },
  });

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      setCargando(true);
      await ejecutarCrear({
        ...data,
        activo: true,
        notas: ""
      });
      router.back();
    } catch (error) {
      if (error.message.includes("registrado") || error.message.includes("email")) {
        setError("email", { type: "manual", message: error.message });
      } else {
        // Si es otro tipo de error
        alert("Error: " + error.message);
      }
      console.log("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={[commonS.screen, {padding: 20, justifyContent: "center"}]}>
      <View style={[formS.container]}>
        <Text style={[commonS.sectionTitle, {textAlign: "center",}]}>Nuevo Cliente</Text>

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
          {/* handleSubmit valida con Zod y luego ejecuta onSubmit */}
          <PrimaryButton 
            onPress={handleSubmit(onSubmit)} 
            text={cargando ? "Guardando..." : "Crear Cliente"}
          />
          
          <SecondaryButton onPress={() => router.back()} text="Cancelar" />
        </View>
      </View>
    </ScrollView>
  );
}
function setError(arg0: string, arg1: { type: string; message: any; }) {
  throw new Error("Function not implemented.");
}

