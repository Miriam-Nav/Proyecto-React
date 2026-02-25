import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Videojuego } from "../types/Videojuegos";

interface VideojuegoCardProps {
  videojuego: Videojuego;
}

export const VideojuegoCard: React.FC<VideojuegoCardProps> = ({ videojuego }) => {
  const theme = useTheme();

  return (
    <View style={{ 
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.outlineVariant,
      marginBottom: 12
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: "bold", 
            color: theme.colors.onSurface, 
            fontFamily: "monospace", 
            marginBottom: 8 
          }}>
            {videojuego.titulo}
          </Text>
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <MaterialCommunityIcons name="controller" size={14} color={theme.colors.onSurfaceVariant} />
              <Text style={{ 
                fontSize: 12, 
                color: theme.colors.onSurfaceVariant, 
                fontFamily: "monospace" 
              }}>
                Plataforma: {videojuego.plataforma}
              </Text>
            </View>
            {videojuego.genero && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialCommunityIcons name="gamepad-variant" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.onSurfaceVariant, 
                  fontFamily: "monospace" 
                }}>
                  Género: {videojuego.genero}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <MaterialCommunityIcons name="currency-eur" size={14} color={theme.colors.primary} />
              <Text style={{ 
                fontSize: 13, 
                color: theme.colors.primary, 
                fontFamily: "monospace", 
                fontWeight: "bold" 
              }}>
                {videojuego.precio_alquiler_dia}€/día
              </Text>
            </View>
            {videojuego.stock !== undefined && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialCommunityIcons 
                  name="package-variant" 
                  size={14} 
                  color={videojuego.stock > 0 ? theme.colors.primary : theme.colors.error} 
                />
                <Text style={{ 
                  fontSize: 12, 
                  fontFamily: "monospace", 
                  fontWeight: "bold",
                  color: videojuego.stock > 0 ? theme.colors.onSurfaceVariant : theme.colors.error 
                }}>
                  Stock: {videojuego.stock}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
