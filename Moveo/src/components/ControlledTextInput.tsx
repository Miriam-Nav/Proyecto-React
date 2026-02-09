import { TextInput, useTheme, HelperText } from "react-native-paper"; 
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native"; 
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
        <View style={{ marginBottom: 10 }}> 
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            placeholder={placeholder}
            placeholderTextColor={theme.colors.outline}
            error={!!errors[name]} 
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />
          {errors[name] && (
            <HelperText type="error" visible={!!errors[name]} style={{ fontWeight: 'bold', fontFamily: 'monospace', }}>
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
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
        <View style={{ marginBottom: 10 }}>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            placeholder={placeholder}
            placeholderTextColor={theme.colors.outline}
            left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
            error={!!errors[name]}
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />
          {errors[name] && (
            <HelperText type="error" visible={!!errors[name]} style={{ fontWeight: 'bold', fontFamily: 'monospace', }}>
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
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
        <View style={{ marginBottom: 10 }}>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            secureTextEntry={!showPassword}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.outline}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!errors[name]}
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />
          {errors[name] && (
            <HelperText type="error" visible={!!errors[name]} style={{ fontWeight: 'bold', fontFamily: 'monospace', }}>
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}