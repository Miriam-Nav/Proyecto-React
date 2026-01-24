import { StyleSheet } from "react-native";

export const modalStyles = (theme) => StyleSheet.create({
  containerModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
    alignItems: "center"
  },

  nameUser: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.onSurface,
    textAlign: "center",
    marginBottom: 20,
  },

  description: {
    fontSize: 14,
    fontFamily: "monospace",
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: 24,
  },
});