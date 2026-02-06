import React, { useMemo, useState } from "react";
import { View, Pressable, ScrollView, Alert } from "react-native";
import { Text, Button, Divider, IconButton, useTheme } from "react-native-paper";
import { logginStyles } from "../styles/loggin.styles";
import { commonStyles } from "../styles/common.styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema, RegisterFormValues, registerSchema } from "../schemas/auth.schema";
import { ControlledEmailInput, ControlledPasswordInput, ControlledTextInput } from "../components/ControlledTextInput";
import { logIn, register } from "../services/authService";
import { useUserStore } from "../stores/user.store";

export default function LoginScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const logginS = logginStyles(theme);

  const setUser = useUserStore((state) => state.setUser);

  // Estado para alternar entre Login y Registro
  const [mode, setMode] = useState<"login" | "register">("login");
  const isRegister = useMemo(() => mode === "register", [mode]);

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: { nombre: "", email: "", password: "", confirmPassword: "" },
    });

    const form = isRegister ? registerForm : loginForm;
    const {
        control,
        formState: { errors, isSubmitting },
    } = form;

    const onSubmitLogin = async (data: LoginFormValues) => {
        try {
            const session = await logIn(data.email, data.password);
            console.log(session);
            setUser(session.user, session.role, session.token);
        } catch (e) {
            console.error("Error:", e);
        }
    };

    const onSubmitRegister = async (data: RegisterFormValues) => {
      try {
        const session = await register(data.email, data.password, data.nombre);
        setUser(session.user, session.role, session.token);
        setMode("login");
      } catch (e) {
        const message = e instanceof Error ? e.message : "No se pudo crear la cuenta";
        Alert.alert("Error", message);
      }
    };

    const toggleMode = () => {
        setMode(isRegister ? "login" : "register");
        loginForm.reset();
        registerForm.reset();
    };
  
  return (
    <ScrollView 
      contentContainerStyle={logginS.screenLoggin}
      keyboardShouldPersistTaps="handled"
    >
      {/* Añade una key para que todo el formulario se refresque al cambiar de modo */}
      <View style={logginS.containerLoggin} key={mode}>

        {/* HEADER */}
        <View style={logginS.headerLoggin}>
          <IconButton
            icon= {isRegister ? "account-plus" : "lock"}
            size={50}
            iconColor={theme.colors.primary}
            containerColor={theme.colors.outlineVariant}
            style={{ marginBottom: 10 }}
            contentStyle={{
              marginLeft: isRegister ? -6 : 0, 
            }}
          />
          <Text style={logginS.titleLoggin}>
            {isRegister ? "CREAR CUENTA" : "BIENVENIDO"}
          </Text>
          <Text style={[commonS.headerSubtitle,{textAlign: "center"}]}>
            {isRegister ? "Regístrate para iniciar sesión" : "Introduce tus credenciales para continuar"}
          </Text>
        </View>

        {/* NOMBRE (Solo en Registro) */}
        {isRegister && (
          <View style={{ marginBottom: 15 }}>
            <Text style={commonS.labelColor}>NOMBRE COMPLETO</Text>
            <ControlledTextInput
              control={control}
              name="nombre"
              placeholder="Ej: Juan Pérez"
              errors={errors}
            />
          </View>
        )}

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
        </View>

        {/* CONFIRMAR PASSWORD (Solo en Registro) */}
        {isRegister && (
          <View style={{ marginBottom: 15 }}>
            <Text style={commonS.labelColor}>CONFIRMAR CONTRASEÑA</Text>
            <ControlledPasswordInput
              control={control}
              name="confirmPassword"
              placeholder="••••••••"
              errors={errors}
            />
          </View>
        )}


        {/* RESET PASSWORD */}
        <Pressable>
          <Text style={[logginS.linkLoggin,{textAlign: "right", marginBottom: 18}]}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Button 
          mode="contained" 
          onPress={
            isRegister ? registerForm.handleSubmit(onSubmitRegister)
            : loginForm.handleSubmit(onSubmitLogin)
          }
          loading={isSubmitting}
          style={logginS.buttonLoggin}
          labelStyle={logginS.buttonLabelLoggin}
        >
          {isSubmitting ? "CARGANDO..." : isRegister ? "REGISTRARME" : "INICIAR SESIÓN"}

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

        {/* REGISTER / LOGIN */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={logginS.register}>
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes una cuenta?"}{" "}
            
              <Pressable onPress={toggleMode}>
                  <Text style={[logginS.linkLoggin, { fontWeight: 'bold' }]}>
                      {isRegister ? "Inicia sesión aquí" : "Regístrate ahora"}
                  </Text>
              </Pressable>
            </Text>
        </View>

      </View>
    </ScrollView>
  );
}

