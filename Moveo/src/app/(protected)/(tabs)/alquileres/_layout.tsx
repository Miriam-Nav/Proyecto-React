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
      />
      <Stack.Screen name="nuevo"/>
    </Stack>
  );
}
