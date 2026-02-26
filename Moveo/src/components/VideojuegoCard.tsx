import React from "react";
import { View } from "react-native";
import { Text, useTheme, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { idStyles } from "../styles/id.styles"; 
import { Videojuego } from "../types/Videojuegos";
import { useDeleteVideojuego } from "../hooks/useVideojuegos";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

interface Props {
  videojuego: Videojuego;
}

export function VideojuegoCard({ videojuego }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const idS = idStyles(theme);
  const deleteVideojuego = useDeleteVideojuego();
  const { show: showConfirmDialog, ConfirmDialog } = useConfirmDialog();

  const handleEliminar = () => {
    showConfirmDialog({
      title: "Eliminar videojuego",
      message: `¿Estás seguro de que quieres eliminar "${videojuego.titulo}"?`,
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          await deleteVideojuego.mutateAsync(videojuego.id);
        } catch (error: unknown) {
          console.error("Error al eliminar videojuego:", error);
        }
      },
    });
  };

  const handleEditar = () => {
    router.push({
      pathname: "/videojuegos/nuevo",
      params: { id: videojuego.id }
    });
  };

  return (
    <>
      <View style={[idS.infoCard]}>
        {/* HEADER: Título y Botones */}
        <View style={[idS.pedidoHeader, { justifyContent: "space-between", alignItems: "center" }]}>
          <Text style={[idS.pedidoCodigo, { flex: 1 }]}>
            {videojuego.titulo}
          </Text>
          
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="pencil"
              size={20}
              mode="contained"
              containerColor={theme.colors.outlineVariant}
              iconColor={theme.colors.onTertiary}
              onPress={handleEditar}
            />
            <IconButton
              icon="delete"
              size={20}
              mode="contained"
              containerColor={theme.colors.outlineVariant}
              iconColor={theme.colors.error}
              onPress={handleEliminar}
            />
          </View>
        </View>

        {/* DETALLES: Precio */}
        <Text style={idS.pedidoFecha}>
          Precio de alquiler: ${videojuego.precio_alquiler_dia.toFixed(2)} / día
        </Text>

        {/* STOCK */}
        <Text style={[idS.pedidoFecha, { marginTop:10, color: theme.colors.primary, fontStyle:"italic" }]}>
          Stock disponible: {videojuego.stock}
        </Text>
      </View>

      <ConfirmDialog />
    </>
  );
}