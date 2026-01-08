import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../../theme";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="clientes"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={22} color={color} />
          ),
        }}
      />

    </Tabs>
  );

}
