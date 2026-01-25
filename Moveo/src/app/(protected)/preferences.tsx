import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, RadioButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../providers/ThemeProvider";
import { commonStyles } from "../../styles/common.styles";
import { formStyles } from "../../styles/form.styles";
import { CustomHeader } from "../../components/HeaderApp";

export default function PreferencesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  
  const { themeMode, setThemeMode } = useThemeContext();

  return (
    <ScrollView style={commonS.screen}>
      {/* HEADER */}
      <CustomHeader title="PREFERENCIAS"/>

      {/* CARD de Temas*/}
      <View style={formS.container}>
        <Text style={commonS.sectionTitle}>SELECCIÓN DE TEMA</Text>

        <RadioButton.Group 
          onValueChange={value => setThemeMode(value as any)} 
          value={themeMode}
        >
          {/* Claro */}
          <View style={{ marginBottom: 10 }}>
            <RadioButton.Item 
              label="MODO CLARO" 
              value="light" 
              labelStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
              mode="android"
              color={theme.colors.primary}
            />
          </View>

          {/* Oscuro */}
          <View style={{ marginBottom: 10 }}>
            <RadioButton.Item 
              label="MODO OSCURO" 
              value="dark" 
              labelStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
              mode="android"
              color={theme.colors.primary}
            />
          </View>

          {/* Sistema */}
          <View>
            <RadioButton.Item 
              label="SISTEMA" 
              value="system" 
              labelStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
              mode="android"
              color={theme.colors.primary}
            />
          </View>
        </RadioButton.Group>
      </View>
    </ScrollView>
  );
}