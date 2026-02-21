import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../providers/ThemeProvider"; 
import { AuthProvider, AuthContext } from "../providers/AuthProvider"; 
import { QueryProvider } from "../providers/QueryProvider";
import { usePushNotifications } from "../hooks/useNotifications";
import { useContext } from "react";

function NotificationsInitializer() {
  // Obtener el authUserId del contexto
  const { authUserId } = useContext(AuthContext);
  
  // Inicializar notificaciones con el userId de Supabase
  usePushNotifications({ userId: authUserId });
  
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