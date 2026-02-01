import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "../providers/ThemeProvider"; 
import { AuthProvider } from "../providers/AuthProvider"; 
import { QueryProvider } from "../providers/QueryProvider"; // El que acabamos de crear

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AuthProvider> 
          <QueryProvider> 
            <ThemeProvider>
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