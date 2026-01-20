import { Text, TextInput } from "react-native-paper";
import {
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearCliente } from "../../../services/clienteService";
import { ClienteFormValues, ClienteSchema } from "../../../schemas/cliente.schema";
import theme from "../../../theme";
import { formStyles } from "../../../styles/form.styles";
import { commonStyles } from "../../../styles/common.styles";

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
  const onSubmit = (data: ClienteFormValues) => {
    crearCliente({
          id: Date.now(),
          nombre: data.nombre,
          email: data.email || "",
          telefono: data.telefono || "",
          activo: true,
        });
    router.back(); 
  };

  return (
    <ScrollView contentContainerStyle={[commonStyles.screen, {padding: 20, justifyContent: "center"}]}>
      <View style={[formStyles.container, /*margin: 20 */]}>
        <Text style={[commonStyles.sectionTitle, {textAlign: "center",}]}>Nuevo Cliente</Text>

        {/* -------- NOMBRE -------- */}
        <Controller
          control={control} 
          name="nombre"     
          render={({ field }) => (
            <TextInput
              value={field.value} 
              onChangeText={field.onChange} 
              mode="outlined"
              placeholder="Nombre"
              placeholderTextColor={theme.colors.placeholder}
              style={[ 
                formStyles.input,
                // Si hay error pone borde rojo
                errors.nombre ? { borderColor: theme.colors.error } : null,
              ]}
              outlineStyle={formStyles.inputOutline}
              contentStyle={formStyles.inputContent}
              onBlur={field.onBlur} 
              
            />
          )}
        />
        {/* Mensaje de error */}
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
          {/* handleSubmit valida con Zod y luego ejecuta onSubmit */}
          <Pressable style={formStyles.btnPrimary} onPress={handleSubmit(onSubmit)}>
            <Text style={formStyles.btnText}>Crear Cliente</Text>
          </Pressable>

          <Pressable style={formStyles.btnSecondary} onPress={() => router.back()}>
            <Text style={[formStyles.btnText, { color: theme.colors.primary, textAlign:"center" }]}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
