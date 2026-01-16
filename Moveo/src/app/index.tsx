import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import theme from "../theme";

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
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <IconButton
            icon="lock"
            size={50}
            iconColor={theme.colors.primary}
            containerColor={theme.colors.outline}
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.title}>BIENVENIDO</Text>
          <Text style={styles.subtitle}>Introduce tus credenciales para continuar</Text>
        </View>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor={theme.colors.placeholder}
            left={<TextInput.Icon icon="email-outline" color={theme.colors.placeholder} />}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CONTRASEÑA</Text>
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
            style={styles.input}
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
          />
        </View>

        {/* RESET PASSWORD */}
        <Pressable>
          <Text style={styles.resetPassword}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          INICIAR SESIÓN
        </Button>

        {/* DIVIDER */}
        <View style={styles.row}>
          <Divider style={styles.divider} />
          <Text style={styles.or}>O CONTINÚA CON</Text>
          <Divider style={styles.divider} />
        </View>

        {/* GOOGLE BUTTON */}
        <Button 
          icon="google" 
          mode="outlined" 
          onPress={() => {}}
          style={styles.googleButton}
          labelStyle={styles.googleButtonLabel}
        >
          GOOGLE
        </Button>

        {/* REGISTER */}
        <Text style={styles.register}>
          ¿No tienes una cuenta?{" "}
          <Pressable>
            <Text style={styles.link}>Regístrate ahora</Text>
          </Pressable>
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingVertical: 20,
  },
  container: {
    width: "90%",
    maxWidth: 450,
    padding: 25,
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: theme.colors.outline,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    color: theme.colors.inputText,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  
  /* INPUTS */
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 6,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.backgroundCard,
    fontFamily: "monospace",
  },
  inputOutline: {
    borderWidth: 3,
    borderColor: theme.colors.outline,
    borderRadius: 10,
  },
  inputContent: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontSize: 14,
  },
  
  resetPassword: {
    textAlign: "right",
    marginBottom: 18,
    color: theme.colors.secondary,
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  button: {
    marginBottom: 18,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  buttonLabel: {
    fontFamily: "monospace",
    letterSpacing: 2,
    fontSize: 14,
    paddingVertical: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.outline,
    marginHorizontal: 12,
  },
  or: {
    textAlign: "center",
    color: theme.colors.placeholder,
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  googleButton: {
    marginBottom: 18,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: 10,
  },
  googleButtonLabel: {
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontSize: 14,
  },
  register: {
    marginTop: 5,
    textAlign: "center",
    color: theme.colors.inputText,
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  link: {
    color: theme.colors.secondary,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
});