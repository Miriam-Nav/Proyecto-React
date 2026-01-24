import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { commonStyles } from "../../styles/common.styles";


export default function HomeScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);

  return (
    <View style={commonS.screen}>
      <View style={commonS.header}>
        <Text style={commonS.headerTitle}>Inicio</Text>
      </View>

      <Text style={commonS.headerTitle}>Hola Usuario!</Text>
    </View>
  );
}
