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

  // Redirige automáticamente si esta autenticado
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // Ruta 
      router.replace("/(protected)/(tabs)/home");
    } else {
      // Si no está autenticado va al login
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  const { setUser } = useUserStore();

  const logIn = async (email: string, pass: string) => {
    // Contraseña 
    const SHARED_PASS = "123456";

    // Busca el email en el array de usuarios de mockApi
    const foundUser = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    // Validación
    if (foundUser && pass === SHARED_PASS) {
      // Busca el objeto Rol del usuario
      const foundRole = roles.find(r => r.id === foundUser.roleId);
      const mockToken = `fake-jwt-token-${foundUser.id}`;

      if (foundRole) {
        // Guarda en Zustand
        setUser(foundUser, foundRole, mockToken);
        
        // Guarda el token para persistencia
        await AsyncStorage.setItem("session-token", mockToken);
        
        // Cambiamos el estado para que Home se cargue
        setIsAuthenticated(true); 
        
        console.log(`Login exitoso: ${foundUser.name} con rol ${foundRole.name}`);
      }
    } else {
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
