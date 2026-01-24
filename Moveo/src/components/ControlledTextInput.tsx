import { TextInput, useTheme } from "react-native-paper";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { themeApp } from "../theme";
import { formStyles } from "../styles/form.styles";
import { useState } from "react";

type Props = {
  control: Control<any>;
  name: string;
  placeholder: string;
  errors: FieldErrors;
  leftIcon?: string;
};

export function ControlledTextInput({ control, name, placeholder, errors }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          mode="outlined"
          placeholder={placeholder}
          placeholderTextColor={themeApp.colors.outline}
          style={[
            formS.input,
            errors[name] ? { borderColor: themeApp.colors.error } : null,
          ]}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />
      )}
    />
  );
}


export function ControlledEmailInput({ control, name, placeholder, errors, leftIcon }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          mode="outlined"
          placeholder={placeholder}
          placeholderTextColor={themeApp.colors.outline}
          left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
          style={[
            formS.input,
            errors[name] ? { borderColor: themeApp.colors.error } : null,
          ]}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />
      )}
    />
  );
}


export function ControlledPasswordInput({ control, name, placeholder, errors }: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          mode="outlined"
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          placeholderTextColor={themeApp.colors.outline}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={[
            formS.input,
            errors[name] ? { borderColor: themeApp.colors.error } : null,
          ]}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />
      )}
    />
  );
}

