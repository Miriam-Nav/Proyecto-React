import React, { useContext, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, Button, Divider, IconButton, useTheme } from "react-native-paper";
import { logginStyles } from "../styles/loggin.styles";
import { commonStyles } from "../styles/common.styles";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../schemas/auth.schema";
import { ControlledEmailInput, ControlledPasswordInput } from "../components/ControlledTextInput";

export default function LoginScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const logginS = logginStyles(theme);

  // const setUser = useUserStore((state) => state.setUser);
  // const [showPassword, setShowPassword] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
  } = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema), 
    mode: "onBlur", 
    defaultValues: { email: "", password: "" }, 
  });

  const { logIn } = useContext(AuthContext);

  const onSubmit = async (data: LoginFormValues) => {
      try {
          await logIn(data.email, data.password);
      } catch (error) {
          console.error("Fallo del login simulado", error);
      }
  };
  
  return (
    <ScrollView 
      contentContainerStyle={logginS.screenLoggin}
      keyboardShouldPersistTaps="handled"
    >
      <View style={logginS.containerLoggin}>

        {/* HEADER */}
        <View style={logginS.headerLoggin}>
          <IconButton
            icon="lock"
            size={50}
            iconColor={theme.colors.primary}
            containerColor={theme.colors.outlineVariant}
            style={{ marginBottom: 10 }}
          />
          <Text style={logginS.titleLoggin}>BIENVENIDO</Text>
          <Text style={[commonS.headerSubtitle,{textAlign: "center"}]}>Introduce tus credenciales para continuar</Text>
        </View>

        {/* EMAIL */}
        <View style={{ marginBottom: 15 }}>
          <Text style={commonS.labelColor}>CORREO ELECTRÓNICO</Text>

          <ControlledEmailInput
            control={control}
            name="email"
            placeholder="nombre@ejemplo.com"
            errors={errors}
            leftIcon="email-outline"
          />

          {errors.email && (
            <Text style={{ color: theme.colors.error }}>{errors.email.message}</Text>
          )}
        </View>

        {/* PASSWORD */}
        <View style={{ marginBottom: 15 }}>
          <Text style={commonS.labelColor}>CONTRASEÑA</Text>

          <ControlledPasswordInput
            control={control}
            name="password"
            placeholder="••••••••"
            errors={errors}
          />

          {errors.password && (
            <Text style={{ color: theme.colors.error }}>{errors.password.message}</Text>
          )}
        </View>


        {/* RESET PASSWORD */}
        <Pressable>
          <Text style={[logginS.linkLoggin,{textAlign: "right", marginBottom: 18}]}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)}
          style={logginS.buttonLoggin}
          labelStyle={logginS.buttonLabelLoggin}
        >
          INICIAR SESIÓN
        </Button>

        {/* DIVIDER */}
        <View style={[commonS.row, {marginVertical: 15}]}>
          <Divider style={logginS.divider} />
          <Text style={logginS.or}>O CONTINÚA CON</Text>
          <Divider style={logginS.divider} />
        </View>

        {/* GOOGLE BUTTON */}
        <Button 
          icon="google" 
          mode="outlined" 
          onPress={() => {}}
          style={logginS.googleButton}
          labelStyle={logginS.googleButtonLabel}
        >
          GOOGLE
        </Button>

        {/* REGISTER */}
        <Text style={logginS.register}>
          ¿No tienes una cuenta?{" "}
          <Pressable>
            <Text style={logginS.linkLoggin}>Regístrate ahora</Text>
          </Pressable>
        </Text>

      </View>
    </ScrollView>
  );
}

