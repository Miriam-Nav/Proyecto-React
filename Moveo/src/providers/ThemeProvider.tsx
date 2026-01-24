import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { darkThemeColors, lightThemeColors } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);

  // Guardar preferencia
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  // Cargar preferencia al iniciar
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("themeMode");
      if (saved) setThemeModeState(saved as ThemeMode);
    })();
  }, []);

  // Determinar si usar dark o light
  useEffect(() => {
    const systemDark = Appearance.getColorScheme() === "dark";

    if (themeMode === "system") {
      setIsDark(systemDark);
    } else {
      setIsDark(themeMode === "dark");
    }
  }, [themeMode]);

  // Crear tema final con tus colores personalizados
  const theme = useMemo(() => {
    if (isDark) {
      return {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          ...darkThemeColors,
        },
      };
    }

    return {
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        ...lightThemeColors,
      },
    };
  }, [isDark]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      isDark,
    }),
    [themeMode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
