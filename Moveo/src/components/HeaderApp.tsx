import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { commonStyles } from "../styles/common.styles";

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const CustomHeader = ({ title, subtitle, showBack = true }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const commonS = commonStyles(theme);

  return (
    <View style={commonS.header}>
      <View style={[commonS.headerRow, { alignItems: 'center' }]}>
        {showBack && (
          <Pressable 
            onPress={() => router.back()}
            style={({ pressed }) => ({ 
                opacity: pressed ? 0.5 : 1,
                justifyContent: 'center'
            })}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={28} 
              color={theme.colors.primary} 
              style={{ marginTop: 1 }}
            />
          </Pressable>
        )}
        
        <Text style={[
          commonS.headerTitle, 
          { textAlignVertical: 'center', marginBottom: 0, marginTop: 0 } 
        ]}>
          {title.toUpperCase()}
        </Text>
      </View>
      
      {subtitle && <Text style={commonS.headerSubtitle}>{subtitle}</Text>}
    </View>
  );
};