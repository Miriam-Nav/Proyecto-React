import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { CustomHeader } from "../../../../components/HeaderApp";
import { SearchDropdown, useSearchDropdown } from "../../../../components/SearchDropdown";
import { DateRangeInput, isValidDate, toAPIDate, diffDays, todayDDMMYYYY } from "../../../../components/DateInputField";
import { RentalSummary } from "../../../../components/RentalSummary";
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { useCreateAlquiler } from "../../../../hooks/useAlquileres";
import { useClientes } from "../../../../hooks/useClientes";
import { useVideojuegos } from "../../../../hooks/useVideojuegos";

export default function NuevoAlquilerScreen() {
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  const router = useRouter();

  const createAlquiler = useCreateAlquiler();
  const { data: clientes = [] } = useClientes();
  const { data: videojuegos = [] } = useVideojuegos();

  const [fechaInicio, setFechaInicio] = useState(todayDDMMYYYY);
  const [fechaFin, setFechaFin] = useState("");
  const [dias, setDias] = useState(1);

  const cliente = useSearchDropdown<(typeof clientes)[0]>((c) => c.nombre);
  const juego = useSearchDropdown<(typeof videojuegos)[0]>((v) => v.titulo);

  const videojuego = videojuegos.find((v) => v.id === juego.selectedId);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(cliente.query.toLowerCase()) ||
      c.email.toLowerCase().includes(cliente.query.toLowerCase())
  );

  const videojuegosFiltrados = videojuegos.filter(
    (v) =>
      v.titulo.toLowerCase().includes(juego.query.toLowerCase()) ||
      v.plataforma.toLowerCase().includes(juego.query.toLowerCase()) ||
      v.genero?.toLowerCase().includes(juego.query.toLowerCase())
  );

  useEffect(() => {
    if (isValidDate(fechaInicio) && isValidDate(fechaFin)) {
      setDias(diffDays(fechaInicio, fechaFin));
    }
  }, [fechaInicio, fechaFin]);

  const totalAPagar = videojuego ? dias * videojuego.precio_alquiler_dia : 0;

  const handleSubmit = async () => {
    if (!cliente.selectedId) return Alert.alert("Error", "Debes seleccionar un cliente");
    if (!juego.selectedId)   return Alert.alert("Error", "Debes seleccionar un videojuego");
    if (!fechaInicio || !fechaFin) return Alert.alert("Error", "Debes completar las fechas");
    if (!isValidDate(fechaInicio)) return Alert.alert("Error", "Fecha de inicio inválida. Usa dd/mm/yyyy");
    if (!isValidDate(fechaFin))    return Alert.alert("Error", "Fecha de fin inválida. Usa dd/mm/yyyy");

    try {
      await createAlquiler.mutateAsync({
        cliente_id: cliente.selectedId,
        videojuego_id: juego.selectedId,
        fecha_inicio: toAPIDate(fechaInicio),
        fecha_fin_prevista: toAPIDate(fechaFin),
        total_pagado: totalAPagar,
      });
      Alert.alert("Bien", "Alquiler creado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo crear el alquiler");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={commonS.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => { cliente.setOpen(false); juego.setOpen(false); }}>
          <CustomHeader title="Nuevo Alquiler" />

          <View style={[formS.container, { padding: 20 }]}>

            {/* CLIENTE */}
            <Text style={commonS.sectionTitle}>CLIENTE</Text>
            <SearchDropdown
              label="Buscar cliente"
              value={cliente.query}
              onChangeText={(text) => { cliente.setQuery(text); cliente.setOpen(true); if (!text) cliente.clear(); }}
              onFocus={() => cliente.setOpen(true)}
              dropdownVisible={cliente.open}
              items={clientesFiltrados}
              keyExtractor={(item) => item.id.toString()}
              onSelectItem={cliente.select}
              renderItem={(item) => (
                <>
                  <Text style={{ fontFamily: "monospace", fontSize: 13, color: theme.colors.onSurface }}>
                    {item.nombre}
                  </Text>
                  <Text style={{ fontFamily: "monospace", fontSize: 11, color: theme.colors.onSurfaceVariant }}>
                    {item.email}
                  </Text>
                </>
              )}
              zIndex={2}
            />

            {/* VIDEOJUEGO */}
            <Text style={commonS.sectionTitle}>VIDEOJUEGO</Text>
            <SearchDropdown
              label="Buscar videojuego"
              value={juego.query}
              onChangeText={(text) => { juego.setQuery(text); juego.setOpen(true); if (!text) juego.clear(); }}
              onFocus={() => juego.setOpen(true)}
              dropdownVisible={juego.open}
              items={videojuegosFiltrados}
              keyExtractor={(item) => item.id.toString()}
              onSelectItem={juego.select}
              renderItem={(item) => (
                <>
                  <Text style={{ fontFamily: "monospace", fontSize: 13, color: theme.colors.onSurface, fontWeight: "bold" }}>
                    {item.titulo}
                  </Text>
                  <Text style={{ fontFamily: "monospace", fontSize: 11, color: theme.colors.onSurfaceVariant }}>
                    {item.plataforma}{item.genero && ` • ${item.genero}`}
                  </Text>
                  <Text style={{ fontFamily: "monospace", fontSize: 11, color: theme.colors.primary, fontWeight: "bold" }}>
                    ${item.precio_alquiler_dia}/día • Stock: {item.stock || 0}
                  </Text>
                </>
              )}
              zIndex={1}
            />

            {videojuego && (
              <View style={{ backgroundColor: theme.colors.surfaceVariant, borderRadius: 8, padding: 12, marginBottom: 20, marginTop: -12 }}>
                <Text style={{ fontFamily: "monospace", fontSize: 11, color: theme.colors.onSurfaceVariant }}>
                  Seleccionado: {videojuego.titulo} - ${videojuego.precio_alquiler_dia}/día
                </Text>
              </View>
            )}

            {/* FECHAS */}
            <Text style={commonS.sectionTitle}>FECHAS</Text>
            <DateRangeInput
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onChangeFechaInicio={setFechaInicio}
              onChangeFechaFin={setFechaFin}
            />

            {/* RESUMEN */}
            {videojuego && isValidDate(fechaInicio) && isValidDate(fechaFin) && (
              <RentalSummary
                dias={dias}
                totalAPagar={totalAPagar}
                videojuegoSeleccionado={{ titulo: videojuego.titulo, precioPorDia: videojuego.precio_alquiler_dia }}
              />
            )}

            {/* BOTONES */}
            <View style={formS.buttons}>
              <PrimaryButton
                text={createAlquiler.isPending ? "Creando..." : "Crear Alquiler"}
                onPress={handleSubmit}
              />
              <SecondaryButton text="Cancelar" onPress={() => router.back()} />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}