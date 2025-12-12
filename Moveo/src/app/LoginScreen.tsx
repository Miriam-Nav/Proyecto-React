import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import theme from '../theme';

export default function LoginScreen() {
  // Estados para guardar el correo ycontraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="lock" 
            size={70} 
            iconColor={theme.colors.primary} 
            containerColor={theme.colors.outline} 
            style={{ alignSelf: 'center', marginBottom: 16 }}
          /> 

          {/* Titulo y subtituo */}
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Introduce tus credenciales para continuar</Text>
        </View>

        {/* Input del correo */}
        <TextInput
          label="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          placeholder="nombre@ejemplo.com"
          left={<TextInput.Icon icon="email-outline"  color={theme.colors.placeholder}/>}
          placeholderTextColor={theme.colors.placeholder}
          style={styles.input}
        />

        {/* Input de la contraseña */}
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock"  color={theme.colors.placeholder}/>}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              color={theme.colors.placeholder} 
            />
          }
          style={styles.input}
        />

        {/* Recuperar Contraseña */}
        <Pressable onPress={() => {}}>
          <Text style={styles.resetPassword}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {/* Boton de Iniciar Sesión */}
        <Button mode="contained" onPress={() => {}} style={styles.button}>
          Iniciar Sesión
        </Button>

        {/* Separador */}
        <View style={styles.row}>
          <Divider style={styles.divider} />
          <Text style={styles.or}>O continúa con</Text>
          <Divider style={styles.divider} />
        </View>


        {/* Iniciar Sesion con Google */}
        <Button icon="google" mode="outlined" onPress={() => {}}>
          Google
        </Button>

        {/* Crear Cuenta */}
        <Text style={styles.register}>
          ¿No tienes una cuenta? <Pressable onPress={() => {}}> <Text style={styles.link}>Regístrate ahora</Text> </Pressable>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,                     
    justifyContent: 'center',    
    alignItems: 'center',        
    backgroundColor: theme.colors.background,
  },
  container: {
    minWidth: 500,
    minHeight: 300,
    padding: 24,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: 10
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.backgroundCard,
  },
  resetPassword: {
    textAlign: 'right',
    marginBottom: 24,
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 24,
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
  },
  row: {
    flexDirection: 'row',       
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,                 
    height: 1,                 
    backgroundColor: theme.colors.primary,
    marginHorizontal: 8,
    marginBottom: 15,
  },
  or: {
    textAlign: 'center',
    marginBottom: 16,
  },
  register: {
    marginTop: 32,
    textAlign: 'center',
  },
  link: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
});
