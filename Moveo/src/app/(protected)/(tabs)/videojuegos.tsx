import React, { useCallback } from "react";
import { View, FlatList, ActivityIndicator, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useVideojuegos } from "../../../hooks/useVideojuegos";
import { commonStyles } from "../../../styles/common.styles";
import { Videojuego } from "../../../types/Videojuegos";
import { VideojuegoCard } from "../../../components/VideojuegoCard";

export default function VideojuegosScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  
  const { data: videojuegos = [], isLoading, error, refetch } = useVideojuegos();

  // Refresca los datos cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderVideojuego = ({ item }: { item: Videojuego }) => (
    <VideojuegoCard videojuego={item} />
  );

  if (isLoading) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando videojuegos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonS.center}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={[commonS.loadingText, { color: theme.colors.error, marginTop: 10 }]}>
          Error al cargar videojuegos
        </Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.primary }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={commonS.screen}>
      {/* HEADER */}
      <View style={[commonS.header, { paddingBottom: 12 }]}>
        <Text style={commonS.headerTitle}>VIDEOJUEGOS</Text>
        <Text style={commonS.headerSubtitle}>CATÁLOGO DISPONIBLE</Text>
      </View>

      {/* LISTA */}
      <View style={{ flex: 1, padding: 10 }}>
        {videojuegos.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
            <MaterialCommunityIcons name="gamepad-variant-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text style={[commonS.loadingText, { marginTop: 10 }]}>
              No hay videojuegos disponibles
            </Text>
          </View>
        ) : (
          <FlatList
            data={videojuegos}
            renderItem={renderVideojuego}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}
