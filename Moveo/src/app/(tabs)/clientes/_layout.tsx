import { Stack } from "expo-router";

export default function ClientesLayout() {
  return (
    
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }}
      />

      {/* Detalle de cliente */}
      <Stack.Screen
        name="[id]"
        options={{ title: "Detalle Cliente" }}
      />

      {/* Pantalla de edición */}
      <Stack.Screen
        name="editar"
        options={{ title: "Editar Cliente", headerShown: false }}
      />

      {/* Pantalla de nuevo cliente */}
      <Stack.Screen
        name="nuevo"
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