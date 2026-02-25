import React from "react";
import { View, Text } from "react-native";
import { TextInput as PaperInput, useTheme } from "react-native-paper";
import { formStyles } from "../styles/form.styles";

// --- Helpers de fecha ---

export const todayDDMMYYYY = (): string => {
  const d = new Date();
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
    .map((n) => String(n).padStart(2, "0"))
    .join("/");
};

export const isValidDate = (s: string): boolean => {
  if (!/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(s)) return false;
  const [d, m, y] = s.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export const toAPIDate = (s: string): string => {
  const [d, m, y] = s.split("/");
  return `${y}-${m}-${d}`;
};

export const diffDays = (start: string, end: string): number => {
  const [d1, m1, y1] = start.split("/").map(Number);
  const [d2, m2, y2] = end.split("/").map(Number);
  const diff = Math.abs(
    new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()
  );
  return Math.max(1, Math.ceil(diff / 86_400_000));
};

// --- Lógica de la Máscara ---

const applyDateMask = (text: string) => {
  // Limpiamos todo lo que no sea número
  const cleaned = text.replace(/\D/g, "");
  let formatted = cleaned;

  if (cleaned.length > 2) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }
  
  // Retornamos máximo 10 caracteres (dd/mm/yyyy)
  return formatted.slice(0, 10);
};

// --- Componentes ---

interface DateInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

function DateInput({ label, value, onChangeText }: DateInputProps) {
  const theme = useTheme();
  const formS = formStyles(theme);
  const hasError = value.length === 10 && !isValidDate(value);

  const handleChangeText = (text: string) => {
    // Aplicamos la máscara antes de llamar al onChange original
    const maskedText = applyDateMask(text);
    onChangeText(maskedText);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <PaperInput
        label={label}
        value={value}
        onChangeText={handleChangeText}
        mode="outlined"
        placeholder="dd/mm/yyyy"
        keyboardType="numeric"
        error={hasError}
        maxLength={10}
        style={formS.input}
        outlineStyle={formS.inputOutline}
        contentStyle={formS.inputContent}
      />
      {hasError && (
        <Text style={formS.error}>
          Fecha no válida. Verifica el día y el mes.
        </Text>
      )}
    </View>
  );
}

interface DateRangeInputProps {
  fechaInicio: string;
  fechaFin: string;
  onChangeFechaInicio: (text: string) => void;
  onChangeFechaFin: (text: string) => void;
}

export function DateRangeInput({
  fechaInicio,
  fechaFin,
  onChangeFechaInicio,
  onChangeFechaFin,
}: DateRangeInputProps) {
  return (
    <View>
      <DateInput
        label="Fecha de inicio"
        value={fechaInicio}
        onChangeText={onChangeFechaInicio}
      />
      <DateInput
        label="Fecha de fin prevista"
        value={fechaFin}
        onChangeText={onChangeFechaFin}
      />
    </View>
  );
}