import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, Button, Divider, IconButton, useTheme, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { logginStyles } from "../styles/loggin.styles";
import { commonStyles } from "../styles/common.styles";
import { themeApp } from "../theme";
import { ControlledEmailInput, ControlledPasswordInput } from "../components/ControlledTextInput";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const commonS = commonStyles(theme);
  const logginS = logginStyles(theme);
  
  const handleLogin = () => {
    router.replace("/(tabs)/home");
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
            iconColor={themeApp.colors.primary}
            containerColor={themeApp.colors.outlineVariant}
            style={{ marginBottom: 10 }}
          />
          <Text style={logginS.titleLoggin}>BIENVENIDO</Text>
          <Text style={[commonS.headerSubtitle,{textAlign: "center"}]}>Introduce tus credenciales para continuar</Text>
        </View>

        {/* EMAIL */}
        <View style={{marginBottom: 15}}>
          <Text style={commonS.labelColor}>CORREO ELECTRÓNICO</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor={theme.colors.outline}
            left={<TextInput.Icon icon="email-outline" color={theme.colors.outline} />}
            style={logginS.inputLoggin}
            outlineStyle={logginS.inputOutlineLoggin}
            contentStyle={logginS.inputContentLoggin}
          />
        </View>

        {/* PASSWORD */}
        <View style={{marginBottom: 15}}>
          <Text style={commonS.labelColor}>CONTRASEÑA</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.outline}
            left={<TextInput.Icon icon="lock" color={theme.colors.outline} />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color={theme.colors.outline}
              />
            }
            style={logginS.inputLoggin}
            outlineStyle={logginS.inputOutlineLoggin}
            contentStyle={logginS.inputContentLoggin}
          />
        </View>


        {/* RESET PASSWORD */}
        <Pressable>
          <Text style={[logginS.linkLoggin,{textAlign: "right", marginBottom: 18}]}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Button 
          mode="contained" 
          onPress={handleLogin} 
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

