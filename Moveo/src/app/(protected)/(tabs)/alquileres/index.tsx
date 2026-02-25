import React, { useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useAlquileresRealtime } from "../../../../hooks/useAlquileres";
import { CustomHeader } from "../../../../components/HeaderApp";
import { commonStyles } from "../../../../styles/common.styles";
import { InfoCardAlquiler } from "@/components/CardApp";
import { clientStyles } from "@/styles/client.styles";

export default function AlquileresScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const clientS = clientStyles(theme);

  const { alquileres, isLoading, error, refetch } = useAlquileresRealtime();

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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={commonS.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        <CustomHeader title="Gestión de Alquileres" />

        <View style={{ padding: 20, paddingTop: 0 }}>
          <Text style={[commonS.sectionTitle, { marginBottom: 10, marginTop: 20 }]}>
            LISTA DE ALQUILERES ({alquileres.length})
          </Text>

          {alquileres.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center", backgroundColor: theme.colors.surfaceVariant, borderRadius: 12 }}>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: "monospace", fontSize: 16, textAlign: "center" }}>
                No hay alquileres aún{"\n"}Presiona el botón + para crear uno
              </Text>
            </View>
          ) : ( 
            alquileres.map((alquiler) => (
              <InfoCardAlquiler 
                key={alquiler.id}
                tituloVideojuego={alquiler.videojuego?.titulo || "Desconocido"}
                nombreCliente={alquiler.cliente?.nombre || "Desconocido"}
                fechaInicio={new Date(alquiler.fecha_inicio).toLocaleDateString()}
                fechaFin={new Date(alquiler.fecha_fin_prevista).toLocaleDateString()}
                estado={alquiler.estado}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* BOTON CREAR CLIENTE */}
      <Link href="/alquileres/nuevo" asChild>
        <Pressable style={clientS.add}>
          <Text style={clientS.addText}>+</Text>
        </Pressable>
      </Link>
    </View>
  );
}