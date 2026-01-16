import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    
    <Stack>
      <Stack.Screen 
        name="clientes" 
        options={{ 
          headerShown: false 
        }}
      />

      {/* Detalle de cliente */}
      <Stack.Screen
        name="clientes/[id]"
        options={{ title: "Detalle Cliente" }}
      />

      {/* Pantalla de edición */}
      <Stack.Screen
        name="clientes/editar"
        options={{ title: "Editar Cliente", headerShown: false }}
      />

      {/* Pantalla de nuevo cliente */}
      <Stack.Screen
        name="clientes/nuevo"
        options={{ title: "Nuevo Cliente", headerShown: false  }}
      />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: false ,
          title: "Actualizar Estado",
        }}
      />

    </Stack>
  );
}