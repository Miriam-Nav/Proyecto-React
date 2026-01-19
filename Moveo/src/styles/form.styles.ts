import { StyleSheet } from "react-native"; 
import theme from "../theme";

export const formStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    margin: 20,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.outline,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontFamily: "monospace",
    color: theme.colors.text,
    fontSize: 16,
  },
  error: {
    color: theme.colors.error,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  
  /* ACTION BUTTONS */
  actionText: { color: theme.colors.onPrimary, fontWeight: "bold" },
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
  btnDanger: {
    flex: 1,
    backgroundColor: theme.colors.error,
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",   
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.error,
  },
  btnText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: 16,
    textAlign: "center"
  },
});

