import React, { useCallback, useMemo, useState } from "react";
import { View, FlatList, ActivityIndicator, Pressable } from "react-native";
import { Text, TextInput, useTheme, FAB } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { clientStyles } from "@/styles/client.styles";
import { commonStyles } from "@/styles/common.styles";
import { useVideojuegos } from "@/hooks/useVideojuegos";
import { VideojuegoCard } from "@/components/VideojuegoCard";

export default function VideojuegosScreen() {
  const [busqueda, setBusqueda] = useState("");
  const theme = useTheme();
  const router = useRouter();
  const commonS = commonStyles(theme);
  const clientS = clientStyles(theme);
  
  const { data: videojuegos = [], isLoading, error, refetch } = useVideojuegos();

  // Refresca los datos cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // FILTRADO
  const juegosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return videojuegos.filter((v) => v.titulo.toLowerCase().includes(texto));
  }, [videojuegos, busqueda]);

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
      <View style={[commonS.header]}>
        <Text style={commonS.headerTitle}>VIDEOJUEGOS</Text>
        <Text style={commonS.headerSubtitle}>CATÁLOGO DISPONIBLE</Text>
      </View>

      {/* LISTA */}
      <View style={{ flex: 1, padding: 10 }}>

        {/* BARRA DE BUSQUEDA */}
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          mode="outlined"
          placeholder="Buscar videojuego..."
          placeholderTextColor={theme.colors.outline}
          style={clientS.buscador}
          outlineStyle={clientS.inputOutline}
          contentStyle={clientS.inputContent}
        />

        {videojuegos.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
            <MaterialCommunityIcons name="gamepad-variant-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text style={[commonS.loadingText, { marginTop: 10 }]}>
              No hay videojuegos disponibles
            </Text>
          </View>
        ) : (
          <FlatList
            data={juegosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => <VideojuegoCard videojuego={item} />}
          />
        )}
      </View>

      {/* BOTÓN NUEVO*/}
        <Link href="/videojuegos/nuevo" asChild>
          <Pressable style={clientS.add}>
            <Text style={clientS.addText}>+</Text>
          </Pressable>
        </Link>
    </View>
  );
}
