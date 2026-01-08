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

      {/* Detalle de cliente */}
      <Stack.Screen
        name="clientes/[id]"
        options={{ title: "Detalle Cliente" }}
      />

      {/* Pantalla de edición */}
      <Stack.Screen
        name="clientes/editar"
        options={{ title: "Editar Cliente" }}
      />

      {/* Pantalla de nuevo cliente */}
      <Stack.Screen
        name="clientes/nuevo"
        options={{ title: "Nuevo Cliente" }}
      />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Actualizar Estado",
        }}
      />

    </Stack>
  );
}
