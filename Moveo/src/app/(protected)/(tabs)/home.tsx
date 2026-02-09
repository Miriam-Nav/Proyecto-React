import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Text, useTheme, Avatar, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useUserStore } from "../../../stores/user.store";
import { commonStyles } from "../../../styles/common.styles";
import { formStyles } from "../../../styles/form.styles";
import { idStyles } from "../../../styles/id.styles";
import { SecondaryButton } from "../../../components/ButtonApp";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
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

          <View style={[idS.avatar, { width: 70, height: 70, borderWidth:0, marginBottom: 10}]} >

          {user?.avatarUrl ? (
              <Avatar.Image 
                source={{ uri: user.avatarUrl + '?t=' + new Date().getTime() }} 
                style={{ marginLeft: 0.35, backgroundColor: 'transparent' }} 
              />
            ) : (
              <Avatar.Text 
                size={80} 
                label={user?.name?.substring(0, 2).toUpperCase() || "US"} 
                labelStyle={{ fontFamily: 'monospace' }}
              />
            )} 
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