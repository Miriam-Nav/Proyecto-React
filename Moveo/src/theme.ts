
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const lightThemeColors = {
  primary: "#510fdfff",
  onPrimary: "#FFFFFF",

  secondary: "#2563eb",
  onSecondary: "#0a0a0a",

  error: "#e72c2cff",
  success: "#10b981",

  successSoft: "#dcfce7",
  errorSoft: "#fee2e2",

  background: "#dad5f5ff",
  
  // Anteriormente: text
  onSurface: "#2b1f47",
  
  // Anteriormente: inputText
  onSurfaceVariant: "#564b6dff",
  
  // Anteriormente: placeholder
  outline: "#998eb1ff",

  surface: "#FFFFFF",
  
  // Anteriormente: backgroundCard
  surfaceVariant: "#f4f1f9ff",

  // Anteriormente: outline (color diferente)
  outlineVariant: "#ccc0f4ff",
};



/// PRUEBAS ///
export const lightThemeColorsV2 = {
  ...DefaultTheme.colors, 

  primary: "#510fdfff",
  onPrimary: "#FFFFFF",

  secondary: "#2563eb",
  onSecondary: "#0a0a0a",

  error: "#e72c2cff",
  success: "#10b981",       
  successSoft: "#dcfce7",   
  errorSoft: "#fee2e2",     

  background: "#dad5f5ff",

  onSurface: "#2b1f47",

  onSurfaceVariant: "#564b6dff",

  outline: "#998eb1ff",

  surface: "#FFFFFF",

  surfaceVariant: "#f4f1f9ff",

  outlineVariant: "#ccc0f4ff",
};

// TEMA CLARO SUAVE
export const softLightTheme = {
  ...DefaultTheme.colors,

  primary: "#7B2FF7",
  onPrimary: "#FFFFFF",

  secondary: "#00A6FF",
  onSecondary: "#00121A",

  error: "#FF3366",
  success: "#00D4A3",

  successSoft: "#D6FFF4",
  errorSoft: "#FFE0EB",

  background: "#F4F2FF",

  onSurface: "#1F1633",
  onSurfaceVariant: "#3A2E5A",
  outline: "#8A7BB5",

  surface: "#FFFFFF",
  surfaceVariant: "#F3EDFF",

  outlineVariant: "#C9B8FF",
};

// TEMA AZUL-ROSA
export const bluePinkTheme = {
  ...DefaultTheme.colors,

  primary: "#0077FF",
  onPrimary: "#FFFFFF",

  secondary: "#FF0099",
  onSecondary: "#1A0010",

  error: "#FF0033",
  success: "#00FF66",

  successSoft: "#D9FFE8",
  errorSoft: "#FFE5EC",

  background: "#F2F6FF",

  onSurface: "#1A1F2E",
  onSurfaceVariant: "#2C324A",
  outline: "#7A7FA0",

  surface: "#FFFFFF",
  surfaceVariant: "#EAF0FF",

  outlineVariant: "#C5D2FF",
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// TEMA GAMING
export const darkThemeColors = {
  ...DefaultTheme.colors,

  primary: "#ff006e",
  onPrimary: "#FFFFFF",

  secondary: "#8338ec",
  onSecondary: "#FFFFFF",

  error: "#ef233c",
  success: "#06ffa5",

  successSoft: "#d4ffef",
  errorSoft: "#ffe0e5",

  background: "#1a1a2e",

  onSurface: "#eaeaea",

  onSurfaceVariant: "#b8b8d1",

  outline: "#6b6b8a",

  surface: "#16213e",
  surfaceVariant: "#0f1624",

  outlineVariant: "#3a506b",
};

// TEMA OSCURO PRO
export const darkProTheme = {
  ...DefaultTheme.colors,

  primary: "#7C3AED",
  onPrimary: "#FFFFFF",

  secondary: "#06B6D4",
  onSecondary: "#0A0A0A",

  error: "#F43F5E",
  success: "#22C55E",

  successSoft: "#064E3B",
  errorSoft: "#7F1D1D",

  background: "#0F172A",

  onSurface: "#E2E8F0",
  onSurfaceVariant: "#CBD5E1",
  outline: "#64748B",

  surface: "#1E293B",
  surfaceVariant: "#334155",

  outlineVariant: "#475569",
};



export const themeApp = {
    ...DefaultTheme,
    colors: lightThemeColors,
    fontFamily: 'Poppins-Regular'
};
