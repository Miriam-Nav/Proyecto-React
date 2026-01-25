import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUserStore } from "../stores/user.store";
import { roles, usuarios } from "../types/mockApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al abrir la app
  useEffect(() => {
    const restoreSession = async () => {
      const token = await AsyncStorage.getItem("session-token");
      if (token) setIsAuthenticated(true);
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Redirigir automáticamente según autenticación
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // Ruta completa según tu estructura de carpetas
      router.replace("/(protected)/(tabs)/home");
    } else {
      // Si no está autenticado, va al login (que es la raíz "/")
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  const { setUser } = useUserStore();

  const logIn = async (email: string, pass: string) => {
    // Definimos la contraseña única para ambos
    const SHARED_PASS = "123456";

    // Simulamos un pequeño retraso de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Buscamos si el email existe en nuestro array de usuarios de mockApi
    const foundUser = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    // 2. Validamos credenciales
    if (foundUser && pass === SHARED_PASS) {
      // 3. Buscamos el objeto Rol completo para ese usuario
      const foundRole = roles.find(r => r.id === foundUser.roleId);
      const mockToken = `fake-jwt-token-${foundUser.id}`;

      if (foundRole) {
        // Guardamos en Zustand (Store global)
        setUser(foundUser, foundRole, mockToken);
        
        // Guardamos el token para persistencia (AsyncStorage)
        await AsyncStorage.setItem("session-token", mockToken);
        
        // Cambiamos el estado para que la Home se cargue
        setIsAuthenticated(true); 
        
        console.log(`Login exitoso: ${foundUser.name} con rol ${foundRole.name}`);
      }
    } else {
      // Si el email no existe o la pass no es 123456
      throw new Error("Credenciales inválidas. Intenta con admin@alquilerapp.com o operario1@alquilerapp.com");
    }
  };



  const logOut = async () => {
    await AsyncStorage.removeItem("session-token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
