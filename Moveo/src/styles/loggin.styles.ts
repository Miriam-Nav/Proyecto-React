import { StyleSheet } from "react-native";
  
export const logginStyles = (theme) => StyleSheet.create({
  screenLoggin: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingVertical: 20,
  },
  containerLoggin: {
    width: "90%",
    maxWidth: 450,
    padding: 25,
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
  },
  headerLoggin: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleLoggin: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  
  /* INPUTS */
  inputLoggin: {
    backgroundColor: theme.colors.surfaceVariant,
    fontFamily: "monospace",
  },
  inputOutlineLoggin: {
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 10,
  },
  inputContentLoggin: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontSize: 14,
  },

  buttonLoggin: {
    marginBottom: 18,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  buttonLabelLoggin: {
    fontFamily: "monospace",
    letterSpacing: 2,
    fontSize: 14,
    paddingVertical: 3,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.outlineVariant,
    marginHorizontal: 12,
  },
  or: {
    textAlign: "center",
    color: theme.colors.outline,
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  googleButton: {
    marginBottom: 18,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: 10,
  },
  googleButtonLabel: {
    color: theme.colors.primary,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontSize: 14,
  },
  register: {
    marginTop: 5,
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  linkLoggin: {
    color: theme.colors.secondary,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontSize: 14
  },
});
