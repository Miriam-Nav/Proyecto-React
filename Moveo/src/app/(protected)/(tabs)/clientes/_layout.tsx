import { Stack } from "expo-router";

export default function ClientesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="editar" />
      <Stack.Screen name="nuevo" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}