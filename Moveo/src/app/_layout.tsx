import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../providers/ThemeProvider"; 
import { AuthProvider, AuthContext } from "../providers/AuthProvider"; 
import { QueryProvider } from "../providers/QueryProvider";
import { usePushNotifications } from "../hooks/useNotifications";
import { useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';

// Mantener el splash screen visible mientras se cargan recursos
SplashScreen.preventAutoHideAsync();

function NotificationsInitializer() {
  // Obtener el authUserId del contexto
  const { authUserId } = useContext(AuthContext);
  
  // Inicializar notificaciones con el userId de Supabase
  usePushNotifications({ userId: authUserId });
  
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error cargando fuentes:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

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