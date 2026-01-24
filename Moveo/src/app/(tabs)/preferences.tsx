import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Switch, useTheme, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../providers/ThemeProvider";

export default function PreferencesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>

        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Preferencias
        </Text>
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.rowTitle, { color: theme.colors.onSurface }]}>
              Tema oscuro
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Activa el modo oscuro en la app.
            </Text>
          </View>

          <RadioButton.Group onValueChange={(value) => setThemeMode(value as any)}
          value={themeMode}>
            <RadioButton.Item label="Claro" value="light" />
            <RadioButton.Item label="Oscuro" value="dark" />
            <RadioButton.Item label="Sistema" value="system" />
          </RadioButton.Group>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
