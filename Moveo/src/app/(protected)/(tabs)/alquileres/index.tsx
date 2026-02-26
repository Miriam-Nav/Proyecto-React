import React, { useCallback } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { Link, useFocusEffect } from "expo-router";
import { useAlquileres } from "../../../../hooks/useAlquileres";
import { commonStyles } from "../../../../styles/common.styles";
import { clientStyles } from "../../../../styles/client.styles";
import { InfoCardAlquiler } from "../../../../components/CardApp";

export default function AlquileresScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const clientS = clientStyles(theme);

  const { data: alquileres = [], isLoading, error, refetch } = useAlquileres();

  // Refresca los datos cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando alquileres...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonS.center}>
        <Text>Error al conectar con el servidor.</Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.primary }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={commonS.screen}>
      {/* HEADER */}
      <View style={commonS.header}>
        <Text style={commonS.headerTitle}>ALQUILERES</Text>
        <Text style={commonS.headerSubtitle}>
          {alquileres.length} alquiler{alquileres.length !== 1 ? "es" : ""} registrado{alquileres.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* LISTA */}
      <View style={{ flex: 1, padding: 10 }}>
        {alquileres.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
            <Text style={{ 
              color: theme.colors.onSurfaceVariant, 
              fontFamily: "monospace", 
              fontSize: 16, 
              textAlign: "center" 
            }}>
              No hay alquileres aún{"\n"}Presiona el botón + para crear uno
            </Text>
          </View>
        ) : (
          <FlatList
            data={alquileres}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <InfoCardAlquiler 
                id={item.id}
                tituloVideojuego={item.videojuego?.titulo || "Desconocido"}
                nombreCliente={item.cliente?.nombre || "Desconocido"}
                fechaInicio={new Date(item.fecha_inicio).toLocaleDateString()}
                fechaFin={new Date(item.fecha_fin_prevista).toLocaleDateString()}
                estado={item.estado}
                monto={item.total_pagado}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* BOTÓN CREAR ALQUILER */}
        <Link href="/alquileres/nuevo" asChild>
          <Pressable style={clientS.add}>
            <Text style={clientS.addText}>+</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}