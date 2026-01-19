import { StyleSheet } from "react-native";
import theme from "../theme";

export const modalStyles = StyleSheet.create({
  containerModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    alignItems: "center"
  },

  nameUser: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },

  description: {
    fontSize: 14,
    fontFamily: "monospace",
    color: theme.colors.inputText,
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 3,
    marginBottom: 12,
  },

  buttonSuccess: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
  },

  buttonError: {
    backgroundColor: theme.colors.errorSoft,
    borderColor: theme.colors.error,
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "monospace",
    color: theme.colors.text,
  },

  cancel: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.secondary,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
});