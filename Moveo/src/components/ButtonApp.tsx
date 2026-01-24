import { Pressable, Text } from "react-native";
import { formStyles } from "../styles/form.styles";
import { themeApp } from "../theme";
import { useTheme } from "react-native-paper";

type Props = {
  text: string;
  onPress: () => void;
  color?: string;
};

export function PrimaryButton({ text, onPress, color }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);
  
  return (
    <Pressable
      style={[
        formS.btnPrimary,
        color && {
          backgroundColor: color,
          borderColor: color,
        },
      ]}
      onPress={onPress}
    >
      <Text style={formS.btnText}>{text}</Text>
    </Pressable>
  );
}


export function SecondaryButton({ text, onPress, color }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);

  const finalColor = color ?? themeApp.colors.primary;

  return (
    <Pressable
      style={[
        formS.btnSecondary,
        { borderColor: finalColor }, 
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          formS.btnText,
          { color: finalColor, textAlign: "center" }, 
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}





