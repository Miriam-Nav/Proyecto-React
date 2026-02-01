import React, {  } from "react";
import { View, ScrollView, } from "react-native";
import { Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useUserStore } from "../../stores/user.store";
import { commonStyles } from "../../styles/common.styles";
import { formStyles } from "../../styles/form.styles";
import { CustomHeader } from "../../components/HeaderApp";
import { PrimaryButton, SecondaryButton } from "../../components/ButtonApp";
import { updateUserProfile } from "../../services/authService";
import { supabase } from "../../config/supabaseClient";
import { ControlledTextInput } from "../../components/ControlledTextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClienteFormValues, ClienteSchema } from "../../schemas/cliente.schema";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  const clearUser = useUserStore.use.clearUser();

  // Datos de Zustand
  const { user, role, token, setUser } = useUserStore();

  // Configuración de React Hook Form usando el esquema de cliente
  const { control, handleSubmit, formState: { errors } } = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: {
      nombre: user?.name || "",
      email: user?.email || "",
      telefono: "",
    },
    mode: "onChange",
  });

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUser(); 
      
      router.replace("/");
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Error al salir";
      console.error("Error al cerrar sesión:", message);
    }
  };

  const handleUpdate = async (data: ClienteFormValues) => {
    // Verifica que tenga los datos necesarios
    if (!user?.id || !role || !token) {
      console.log("Faltan datos para actualizar");
      return;
    }

    try {
      console.log("Actualizando en Supabase");
      
      const usuarioActualizado = await updateUserProfile({
        id: user.id,
        name: data.nombre, // Usamos data.nombre de RHF
        email: user.email 
      });

      // Si Supabase responde OK actualiza Zustand
      setUser(usuarioActualizado, role, token);

    } catch (error: any) {
      console.error("Error al guardar:", error.message);
    }
  }

  return (
    <ScrollView style={commonS.screen}>
      {/* HEADER con Flecha */}
      <CustomHeader title="Mi Perfil"/>

      {/* AVATAR Y ROL */}
      <View style={[formS.container, { alignItems: 'center' }]}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.substring(0, 2).toUpperCase() || "US"} 
          style={{ backgroundColor: theme.colors.primary, marginBottom: 15 }}
          labelStyle={{ fontFamily: 'monospace' }}
        />
        <Text style={commonS.labelColor}>ROL ACTUAL: {role?.name}</Text>
      </View>

      {/* FORMULARIO DE EDICIÓN */}
      <View style={formS.container}>
        <Text style={commonS.sectionTitle}>EDITAR DATOS</Text>

        <Text style={commonS.labelColor}>Nombre de usuario</Text>
        <ControlledTextInput
          control={control}
          name="nombre"
          placeholder="Tu nombre"
          errors={errors}
        />

        <Text style={commonS.labelColor}>Email</Text>
        <TextInput
          mode="outlined"
          value={user?.email}
          disabled
          style={[formS.input, { opacity: 0.7 }]}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />

        {/* BOTÓN GUARDAR*/}
        <View style={{ marginTop: 10 }}>
          <PrimaryButton text={"GUARDAR CAMBIOS"} onPress={handleSubmit(handleUpdate)}/>
        </View>
      </View>

      {/* BOTÓN CERRAR SESIÓN */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <SecondaryButton text={"CERRAR SESIÓN "} onPress={logOut} color={theme.colors.error}/>
      </View>
    </ScrollView>
  );
}