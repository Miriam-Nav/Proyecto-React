import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import theme from "../../theme";

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hola Usuario!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "monospace",
    margin: 20,
    color: theme.colors.primary,
  },
});
