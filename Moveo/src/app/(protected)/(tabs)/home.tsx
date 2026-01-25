import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Text, useTheme, Avatar, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useUserStore } from "../../../stores/user.store";
import { commonStyles } from "../../../styles/common.styles";
import { formStyles } from "../../../styles/form.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { idStyles } from "../../../styles/id.styles";
import { SecondaryButton } from "../../../components/ButtonApp";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  const idS = idStyles(theme);

  // Datos y el ROL de Zustand
  const { user, role } = useUserStore();

  const isAdmin = role?.name === "ADMIN";

  return (
    <ScrollView style={commonS.screen}>
      {/* HEADER */}
      <View style={[commonS.header, { paddingBottom: 12 }]}>
        <View style={[commonS.headerRow,{justifyContent: "space-between"}]}>
          <View>
            <Text style={commonS.headerTitle}>BIENVENIDO</Text>
            <Text style={commonS.headerSubtitle}>{user?.name?.toUpperCase()}</Text>
            <Text style={[commonS.labelColor, { marginTop: 5, fontSize: 12 }]}>
              ROL: {role?.name}
            </Text>
          </View>
          <View style={[idS.avatar, { width: 65, height: 65, borderWidth:0, marginBottom: 10}]} >
              <Text style={[idS.avatarText, { fontSize: 26 }]}>{user?.name?.substring(0, 2).toUpperCase() || "U"}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 50, gap: 30 }}>
        
        {/* PERFIL */}
        <SecondaryButton text={"MI PERFIL"}  
          onPress={() => router.push("/(protected)/profile")} 
          borderColor={theme.colors.outlineVariant}/>

        {/* PREFERENCIAS */}
        {isAdmin && (
          <SecondaryButton text={"AJUSTES DE SISTEMA"}  
          onPress={() => router.push("/(protected)/preferences")}
          borderColor={theme.colors.outlineVariant}/>
        )}

      </View>
    </ScrollView>
  );
}