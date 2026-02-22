import { TextInput, useTheme, HelperText } from "react-native-paper"; 
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native"; 
import { formStyles } from "../styles/form.styles";
import { useState } from "react";

type Props = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  label?: string;
  errors: FieldErrors;
  leftIcon?: string;
  editable?: boolean;
};

export function ControlledTextInput({
  control,
  name,
  placeholder,
  label,
  errors,
  leftIcon,
  editable = true,
}: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={{ marginBottom: 10 }}> 
          <TextInput
            value={field.value?.toString() ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            placeholder={placeholder}
            label={label}
            placeholderTextColor={theme.colors.outline}
            left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
            error={!!errors[name]} 
            editable={editable}
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />

          {errors[name] && (
            <HelperText
              type="error"
              visible={!!errors[name]}
              style={{ fontWeight: "bold", fontFamily: "monospace" }}
            >
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

// Componente especializado para inputs de email
export function ControlledEmailInput({
  control,
  name,
  placeholder,
  label,
  errors,
  leftIcon = "email-outline",
  editable = true,
}: Props) {
  const theme = useTheme();
  const formS = formStyles(theme);
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={{ marginBottom: 10 }}> 
          <TextInput
            value={field.value?.toString() ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            placeholder={placeholder}
            label={label}
            placeholderTextColor={theme.colors.outline}
            left={<TextInput.Icon icon={leftIcon} />}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!errors[name]} 
            editable={editable}
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />

          {errors[name] && (
            <HelperText
              type="error"
              visible={!!errors[name]}
              style={{ fontWeight: "bold", fontFamily: "monospace" }}
            >
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

// Componente especializado para inputs de contraseña
export function ControlledPasswordInput({
  control,
  name,
  placeholder,
  label,
  errors,
  editable = true,
}: Omit<Props, 'leftIcon'>) {
  const theme = useTheme();
  const formS = formStyles(theme);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={{ marginBottom: 10 }}> 
          <TextInput
            value={field.value?.toString() ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            mode="outlined"
            placeholder={placeholder}
            label={label}
            placeholderTextColor={theme.colors.outline}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon 
                icon={isPasswordVisible ? "eye-off" : "eye"} 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            }
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoComplete="password"
            error={!!errors[name]} 
            editable={editable}
            style={formS.input}
            outlineStyle={formS.inputOutline}
            contentStyle={formS.inputContent}
          />

          {errors[name] && (
            <HelperText
              type="error"
              visible={!!errors[name]}
              style={{ fontWeight: "bold", fontFamily: "monospace" }}
            >
              {errors[name]?.message as string}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}
