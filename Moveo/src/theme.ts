
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

// TEMA CLARO
export const lightThemeColors = {
  ...DefaultTheme.colors,

  primary: "#ee1d77",
  onPrimary: "#FFFFFF",

  secondary: "#c285f4",
  onSecondary: "#FFFFFF",

  error: "#e42948", 
  onError: "#0dc86b", 

  background: "#fdfdff",   

  onSurface: "#1a1a2e",        
  onSurfaceVariant: "#5a5a75", 

  outline: "#8b8ba7",

  surface: "#FFFFFF",    
  surfaceVariant: "#f1f3f9", 

  outlineVariant: "#e2e8f0", 
};

// TEMA OSCURO
export const darkThemeColors = {
  ...DefaultTheme.colors,

  primary: "#ee1d77",
  onPrimary: "#FFFFFF",

  secondary: "#6c2ce3",
  onSecondary: "#FFFFFF",

  error: "#e44444",
  onError: "#00a86b", 

  background: "#1a1a2e",

  onSurface: "#eaeaea",

  onSurfaceVariant: "#b8b8d1",

  outline: "#6b6b8a",

  surface: "#16213e",
  surfaceVariant: "#0f1624",

  outlineVariant: "#3a506b",
};



// /// PRUEBAS DE TEMA///
// export const lightThemeColorsV2 = {
//   ...DefaultTheme.colors, 

//   primary: "#510fdfff",
//   onPrimary: "#FFFFFF",

//   secondary: "#2563eb",
//   onSecondary: "#0a0a0a",

//   error: "#e72c2cff",
//   onError: "#10b981",       

//   background: "#dad5f5ff",

//   onSurface: "#2b1f47",

//   onSurfaceVariant: "#564b6dff",

//   outline: "#998eb1ff",

//   surface: "#FFFFFF",

//   surfaceVariant: "#f4f1f9ff",

//   outlineVariant: "#ccc0f4ff",
// };

// // TEMA CLARO SUAVE
// export const softLightTheme = {
//   ...DefaultTheme.colors,

//   primary: "#7B2FF7",
//   onPrimary: "#FFFFFF",

//   secondary: "#00A6FF",
//   onSecondary: "#00121A",

//   error: "#FF3366",
//   onError: "#00D4A3",

//   background: "#F4F2FF",

//   onSurface: "#1F1633",
//   onSurfaceVariant: "#3A2E5A",
//   outline: "#8A7BB5",

//   surface: "#FFFFFF",
//   surfaceVariant: "#F3EDFF",

//   outlineVariant: "#C9B8FF",
// };

// // TEMA AZUL-ROSA
// export const bluePinkTheme = {
//   ...DefaultTheme.colors,

//   primary: "#0077FF",
//   onPrimary: "#FFFFFF",

//   secondary: "#FF0099",
//   onSecondary: "#1A0010",

//   error: "#FF0033",
//   onError: "#00FF66",

//   background: "#F2F6FF",

//   onSurface: "#1A1F2E",
//   onSurfaceVariant: "#2C324A",
//   outline: "#7A7FA0",

//   surface: "#FFFFFF",
//   surfaceVariant: "#EAF0FF",

//   outlineVariant: "#C5D2FF",
// };


// // TEMA OSCURO V2
// export const darkThemeV2 = {
//   ...DefaultTheme.colors,

//   primary: "#7C3AED",
//   onPrimary: "#FFFFFF",

//   secondary: "#06B6D4",
//   onSecondary: "#0A0A0A",

//   error: "#F43F5E",
//   onError: "#22C55E",

//   background: "#0F172A",

//   onSurface: "#E2E8F0",
//   onSurfaceVariant: "#CBD5E1",
//   outline: "#64748B",

//   surface: "#1E293B",
//   surfaceVariant: "#334155",

//   outlineVariant: "#475569",
// };



export const themeApp = {
    ...DefaultTheme,
    colors: lightThemeColors,
    fontFamily: 'Poppins-Regular'
};
