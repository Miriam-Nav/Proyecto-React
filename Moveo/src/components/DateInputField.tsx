import React from "react";
import { View, Text } from "react-native";
import { TextInput as PaperInput, useTheme } from "react-native-paper";

// Helpers de fecha
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

// Componentes

interface DateInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

function DateInput({ label, value, onChangeText }: DateInputProps) {
  const theme = useTheme();
  const hasError = value.length > 0 && !isValidDate(value);

  return (
    <View>
      <PaperInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        placeholder="dd/mm/yyyy"
        keyboardType="numeric"
        error={hasError}
        style={{ fontFamily: "monospace", fontSize: 13 }}
      />
      {hasError && (
        <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
          Formato inválido. Usa dd/mm/yyyy
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
      <View style={{ marginBottom: 20 }}>
        <DateInput
          label="Fecha de inicio (dd/mm/yyyy)"
          value={fechaInicio}
          onChangeText={onChangeFechaInicio}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <DateInput
          label="Fecha de fin (dd/mm/yyyy)"
          value={fechaFin}
          onChangeText={onChangeFechaFin}
        />
      </View>
    </View>
  );
}