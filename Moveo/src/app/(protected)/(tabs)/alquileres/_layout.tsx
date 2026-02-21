import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function AlquileresLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Alquileres",
        }}
      />
      <Stack.Screen
        name="nuevo"
        options={{
          title: "Nuevo Alquiler",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="videojuegos"
        options={{
          title: "Catálogo de Videojuegos",
        }}
      />
    </Stack>
  );
}
