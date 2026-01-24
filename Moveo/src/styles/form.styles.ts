import { StyleSheet } from "react-native"; 

export const formStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
    margin: 20,
  },
  input: {
    backgroundColor: theme.colors.surface,
    marginBottom: 15,
    padding: 3,
  },
  inputOutline: {
    borderWidth: 3,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 10,
  },
  inputContent: {
    color: theme.colors.onSurface,
    paddingVertical: 4,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontSize: 14,
  },
  error: {
    color: theme.colors.error,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  
  /* ACTION BUTTONS */
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  btnText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: 16,
    textAlign: "center"
  },
});

