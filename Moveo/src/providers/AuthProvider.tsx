import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al iniciar la app
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("session-token");
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    })();
  }, []);

  // Login simulado
  const login = async (email: string, password: string) => {
    // Simulación de login
    await new Promise((res) => setTimeout(res, 800));

    // Guardar token mock
    await AsyncStorage.setItem("session-token", "mock-token");

    setIsAuthenticated(true);
  };

  // Logout
  const logout = async () => {
    await AsyncStorage.removeItem("session-token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
