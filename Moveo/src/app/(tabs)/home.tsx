import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { commonStyles } from "../../styles/common.styles";
export default function HomeScreen() {
  return (
    
    <View style={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Inicio</Text>
      </View>

      <Text style={commonStyles.headerTitle}>Hola Usuario! </Text>

    </View>
  );
}


