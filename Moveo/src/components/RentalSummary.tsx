import { formStyles } from "@/styles/form.styles";
import { idStyles } from "@/styles/id.styles";
import React from "react";
import { View, Text } from "react-native";
import { Card, useTheme } from "react-native-paper";

interface RentalSummaryProps {
  dias: number;
  totalAPagar: number;
  videojuegoSeleccionado?: {
    titulo: string;
    precioPorDia: number;
  };
}

export function RentalSummary({
  dias,
  totalAPagar,
  videojuegoSeleccionado,
}: RentalSummaryProps) {
  const theme = useTheme();
  const idS = idStyles(theme);

  return (
    
    <Card style={[idS.infoCard, { marginBottom: 10, padding:0 }]}>
      <Card.Content>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "monospace",
            color: theme.colors.onSurface,
            marginBottom: 12,
          }}
        >
          Resumen del Alquiler
        </Text>

        {videojuegoSeleccionado && (
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              <Text style={{ fontWeight: "600" }}>Videojuego:</Text>{" "}
              {videojuegoSeleccionado.titulo}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              <Text style={{ fontWeight: "600" }}>Precio por día:</Text> $
              {videojuegoSeleccionado.precioPorDia.toFixed(2)}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              fontFamily: "monospace"
            }}
          >
            Días de alquiler:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.onSurface,
            }}
          >
            {dias}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outlineVariant,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.colors.onSurface,
              fontFamily: "monospace",
            }}
          >
            Total a pagar:
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            ${totalAPagar.toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
