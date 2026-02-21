import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useTheme, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAlquileresRealtime } from "../../../../hooks/useAlquileres";
import { CustomHeader } from "../../../../components/HeaderApp";
import { commonStyles } from "../../../../styles/common.styles";

export default function AlquileresScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const router = useRouter();

  // Hook que escucha los cambios en la tabla 'alquileres'
  const { alquileres, isLoading, realtimeStatus } = useAlquileresRealtime();

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo': return theme.colors.primary;
      case 'finalizado': return theme.colors.tertiary;
      case 'retrasado': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  if (isLoading) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando alquileres...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={commonS.screen} contentContainerStyle={{ paddingBottom: 100 }}>
        <CustomHeader title="Gestión de Alquileres" />

        {/* Indicador de Realtime: Fundamental para saber si el socket está vivo */}
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: realtimeStatus === 'CONNECTED' ? theme.colors.secondaryContainer : theme.colors.errorContainer,
          }}>
            <Text style={{
              color: realtimeStatus === 'CONNECTED' ? theme.colors.onSecondaryContainer : theme.colors.onErrorContainer,
              fontWeight: 'bold', fontSize: 11, fontFamily: 'monospace',
            }}>
              {realtimeStatus === 'CONNECTED' ? '● Conectado (tiempo real)' : '● Desconectado'}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20, paddingTop: 0 }}>
          <Text style={[commonS.sectionTitle, { marginBottom: 10 }]}>
            LISTA DE ALQUILERES ({alquileres.length})
          </Text>

          {alquileres.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, borderRadius: 12 }}>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', fontSize: 16, textAlign: 'center' }}>
                No hay alquileres aún{'\n'}Presiona el botón + para crear uno
              </Text>
            </View>
          ) : (
            alquileres.map((alquiler) => (
              <View
                key={alquiler.id}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: theme.colors.outlineVariant,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14, color: theme.colors.onSurface }}>
                      {alquiler.videojuego?.titulo || 'Videojuego desconocido'}
                    </Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.colors.onSurfaceVariant }}>
                      Cliente: {alquiler.cliente?.nombre || 'Desconocido'}
                    </Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 11, color: theme.colors.onSurfaceVariant }}>
                      {new Date(alquiler.fecha_inicio).toLocaleDateString()} - {new Date(alquiler.fecha_fin_prevista).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: getEstadoColor(alquiler.estado), height: 24 }}>
                    <Text style={{ color: theme.colors.surface, fontWeight: 'bold', fontSize: 11, fontFamily: 'monospace' }}>
                      {alquiler.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Botón para navegar a la pantalla de creación */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        }}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/alquileres/nuevo')}
      />
    </View>
  );
}