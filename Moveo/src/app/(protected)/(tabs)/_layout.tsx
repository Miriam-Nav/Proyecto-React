import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserStore } from "../../../stores/user.store";
import { useTheme } from "react-native-paper";

export default function TabsLayout() {
  const { role } = useUserStore();
  const isAdmin = role?.name === "ADMIN";
  const theme = useTheme();

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary, 
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface, 
          borderTopColor: theme.colors.outlineVariant, 
        },
        tabBarLabelStyle: {
          fontFamily: "monospace", 
          fontWeight: "bold",
        }
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "home" : "home-outline"} 
              size={26} 
              color={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="clientes" 
        options={{ 
          title: "Clientes",
          href: isAdmin ? "/(protected)/(tabs)/clientes" : null,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "account-group" : "account-group-outline"} 
              size={26} 
              color={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="alquileres" 
        options={{ 
          title: "Alquileres",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "package-variant" : "package-variant-closed"} 
              size={26} 
              color={color} 
            />
          )
        }} 
      />
    </Tabs>
  );
}