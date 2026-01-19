import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import theme from "../theme";
import { logginStyles } from "../styles/loggin.styles";
import { commonStyles } from "../styles/common.styles";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView 
      contentContainerStyle={logginStyles.screenLoggin}
      keyboardShouldPersistTaps="handled"
    >
      <View style={logginStyles.containerLoggin}>

        {/* HEADER */}
        <View style={logginStyles.headerLoggin}>
          <IconButton
            icon="lock"
            size={50}
            iconColor={theme.colors.primary}
            containerColor={theme.colors.outline}
            style={{ marginBottom: 10 }}
          />
          <Text style={logginStyles.titleLoggin}>BIENVENIDO</Text>
          <Text style={[commonStyles.headerSubtitle,{textAlign: "center"}]}>Introduce tus credenciales para continuar</Text>
        </View>

        {/* EMAIL */}
        <View style={{marginBottom: 15}}>
          <Text style={commonStyles.labelColor}>CORREO ELECTRÓNICO</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor={theme.colors.placeholder}
            left={<TextInput.Icon icon="email-outline" color={theme.colors.placeholder} />}
            style={logginStyles.inputLoggin}
            outlineStyle={logginStyles.inputOutlineLoggin}
            contentStyle={logginStyles.inputContentLoggin}
          />
        </View>

        {/* PASSWORD */}
        <View style={{marginBottom: 15}}>
          <Text style={commonStyles.labelColor}>CONTRASEÑA</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.placeholder}
            left={<TextInput.Icon icon="lock" color={theme.colors.placeholder} />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color={theme.colors.placeholder}
              />
            }
            style={logginStyles.inputLoggin}
            outlineStyle={logginStyles.inputOutlineLoggin}
            contentStyle={logginStyles.inputContentLoggin}
          />
        </View>

        {/* RESET PASSWORD */}
        <Pressable>
          <Text style={[logginStyles.linkLoggin,{textAlign: "right", marginBottom: 18}]}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={logginStyles.buttonLoggin}
          labelStyle={logginStyles.buttonLabelLoggin}
        >
          INICIAR SESIÓN
        </Button>

        {/* DIVIDER */}
        <View style={[commonStyles.row, {marginVertical: 15}]}>
          <Divider style={logginStyles.divider} />
          <Text style={logginStyles.or}>O CONTINÚA CON</Text>
          <Divider style={logginStyles.divider} />
        </View>

        {/* GOOGLE BUTTON */}
        <Button 
          icon="google" 
          mode="outlined" 
          onPress={() => {}}
          style={logginStyles.googleButton}
          labelStyle={logginStyles.googleButtonLabel}
        >
          GOOGLE
        </Button>

        {/* REGISTER */}
        <Text style={logginStyles.register}>
          ¿No tienes una cuenta?{" "}
          <Pressable>
            <Text style={logginStyles.linkLoggin}>Regístrate ahora</Text>
          </Pressable>
        </Text>

      </View>
    </ScrollView>
  );
}

