import React from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Text, useTheme, Avatar, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserStore } from "../../../stores/userStore";
import { commonStyles } from "../../../styles/common.styles";
import { homeStyles } from "../../../styles/home.styles";
import { useAlquileresRealtime } from "../../../hooks/useAlquileres";
import { useClientesRealtime } from "../../../hooks/useClientes";
import { useVideojuegosRealtime } from "../../../hooks/useVideojuegos";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const homeS = homeStyles(theme);

  // Datos del usuario
  const { user, role } = useUserStore();
  const isAdmin = role?.name === "ADMIN";

  // Obtener estadísticas con Realtime
  const { data: alquileres = [], isLoading: loadingAlquileres } = useAlquileresRealtime();
  const { data: clientes = [], isLoading: loadingClientes } = useClientesRealtime();
  const { data: videojuegos = [], isLoading: loadingVideojuegos } = useVideojuegosRealtime();

  const isLoading = loadingAlquileres || loadingClientes || loadingVideojuegos;

  return (
    <ScrollView style={commonS.screen}>
      {/* HEADER */}
      <View style={[commonS.header, { paddingBottom: 12 }]}>
        <View style={[commonS.headerRow, { justifyContent: "space-between", alignItems: "flex-start" }]}>
          {/* Avatar con botón de editar */}
          <Pressable 
            style={[homeS.avatarContainer, { marginRight:10 }]}
            onPress={() => router.push("/(protected)/profile")}
          >
            <View style={homeS.avatarWrapper}>
              {user?.avatarUrl ? (
                <Avatar.Image 
                  size={74}
                  source={{ uri: user.avatarUrl + '?t=' + new Date().getTime() }} 
                  style={{ backgroundColor: 'transparent' }} 
                />
              ) : (
                <Avatar.Text 
                  size={74} 
                  label={user?.name?.substring(0, 2).toUpperCase() || "US"} 
                  labelStyle={{ fontFamily: 'monospace' }}
                />
              )} 
            </View>
            <View style={homeS.editButton}>
              <MaterialCommunityIcons 
                name="pencil" 
                size={16} 
                color={theme.colors.onPrimary}
              />
            </View>
          </Pressable>

          <View style={{ flex: 1, marginTop: 40 }}>
            <Text style={commonS.headerSubtitle}>{user?.name?.toUpperCase()}</Text>
            <Text style={[commonS.labelColor, { marginTop: 5, fontSize: 12 }]}>
              ROL: {role?.name}
            </Text>
          </View>

          {/* Botón de ajustes*/}
          {isAdmin && (
            <IconButton
              icon="cog"
              size={28}
              mode="contained"
              containerColor={theme.colors.outlineVariant}
              iconColor={theme.colors.onTertiary}
              style={{ marginTop: 20 }}
              onPress={() => router.push("/(protected)/preferences")}
            />
          )}

          
        </View>
      </View>

      {/* ESTADÍSTICAS */}
      <View style={homeS.statsContainer}>
        <Text style={commonS.sectionTitle}>ESTADÍSTICAS</Text>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={commonS.loadingText}>Cargando estadísticas...</Text>
          </View>
        ) : (
          <>
            {/* Card de Alquileres (solo admin) */}
            {isAdmin && (
              <View style={homeS.statCard}>
                <View style={homeS.statIconContainer}>
                  <MaterialCommunityIcons 
                    name="package-variant" 
                    size={30} 
                    color={theme.colors.primary}
                  />
                </View>
                <View style={homeS.statContent}>
                  <Text style={homeS.statLabel}>ALQUILERES</Text>
                  <Text style={homeS.statValue}>{alquileres.length}</Text>
                </View>
              </View>
            )}

            {/* Card de Clientes (solo admin) */}
            {isAdmin && (
              <View style={homeS.statCard}>
                <View style={homeS.statIconContainer}>
                  <MaterialCommunityIcons 
                    name="account-group" 
                    size={30} 
                    color={theme.colors.primary}
                  />
                </View>
                <View style={homeS.statContent}>
                  <Text style={homeS.statLabel}>CLIENTES</Text>
                  <Text style={homeS.statValue}>{clientes.length}</Text>
                </View>
              </View>
            )}

            {/* Card de Videojuegos */}
            <View style={homeS.statCard}>
              <View style={homeS.statIconContainer}>
                <MaterialCommunityIcons 
                  name="gamepad-variant" 
                  size={30} 
                  color={theme.colors.primary}
                />
              </View>
              <View style={homeS.statContent}>
                <Text style={homeS.statLabel}>VIDEOJUEGOS</Text>
                <Text style={homeS.statValue}>{videojuegos.length}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}