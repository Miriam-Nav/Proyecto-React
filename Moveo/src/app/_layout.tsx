import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    
    <Stack>

      {/* Pantalla de login */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Tabs principales */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}
