import { Pressable, Text, View } from "react-native";
import { formStyles } from "../styles/form.styles";
import { useTheme } from "react-native-paper";

type Props = {
  text: string;
  onPress: () => void;
  color?: string;
  borderColor?: string;
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

export function SecondaryButton({ text, onPress, color, borderColor }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);

  const textColor = color ?? theme.colors.primary;
  const finalBorderColor = borderColor ?? color ?? theme.colors.primary;

  return (
    <Pressable
      style={[
        formS.btnSecondary, 
        { borderColor: finalBorderColor }
      ]}
      onPress={onPress}
    >
      <Text style={[formS.btnText, { color: textColor, textAlign: "center" }]}>
        {text}
      </Text>
    </Pressable>
  );
}