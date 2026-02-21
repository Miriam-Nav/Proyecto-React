import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../providers/ThemeProvider"; 
import { AuthProvider } from "../providers/AuthProvider"; 
import { QueryProvider } from "../providers/QueryProvider";
import { useNotifications } from "../hooks/useNotifications";
import { useEffect } from "react";

function NotificationsInitializer() {
  // Inicializar notificaciones después de que los providers estén listos
  useNotifications();
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AuthProvider> 
          <QueryProvider> 
            <ThemeProvider>
              <NotificationsInitializer />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(protected)" />
              </Stack>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}