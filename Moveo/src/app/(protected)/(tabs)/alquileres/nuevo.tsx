import { View, ScrollView, Alert } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlquilerSchema, AlquilerFormValues } from "../../../../schemas/alquiler.schema";
import { useClientes } from "../../../../hooks/useClientes";
import { useVideojuegos } from "../../../../hooks/useVideojuegos";
import { useCreateAlquiler } from "../../../../hooks/useAlquileres";
import { DateRangeInput, toAPIDate, diffDays, isValidDate } from "../../../../components/DateInputField"; 
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { RentalSummary } from "../../../../components/RentalSummary"; 
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { useState, useEffect } from "react";
import { SearchDropdown } from "@/components/SearchDropdown";

export default function NuevoAlquiler() {
  const theme = useTheme();
  const router = useRouter();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

  const { data: clientes = [] } = useClientes();
  const { data: videojuegos = [] } = useVideojuegos();
  const createAlquiler = useCreateAlquiler();

  const [cargando, setCargando] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<AlquilerFormValues>({
      resolver: zodResolver(AlquilerSchema),
      defaultValues: {
        cliente_id: 0,
        videojuego_id: 0,
        fecha_inicio: "",
        fecha_fin_prevista: "",
        total_pagado: 0,
      },
    });

  const fechaInicio = watch("fecha_inicio");
  const fechaFin = watch("fecha_fin_prevista");
  const videojuegoId = watch("videojuego_id");

  // --- LÓGICA DE CÁLCULO ---
  const videojuego = videojuegos.find(v => v.id === videojuegoId);
  
  // Solo calcula si las fechas son válidas (tienen 10 caracteres y formato correcto)
  const fechasListas = fechaInicio?.length === 10 && fechaFin?.length === 10 && isValidDate(fechaInicio) && isValidDate(fechaFin);
  const dias = fechasListas ? diffDays(fechaInicio, fechaFin) : 0;
  const total = videojuego ? dias * videojuego.precio_alquiler_dia : 0;

  // Actualiza el valor del formulario solo cuando cambia el total calculado
  useEffect(() => {
    setValue("total_pagado", total);
  }, [total, setValue]);

  const onSubmit = async (data: AlquilerFormValues) => {
    try {
      setCargando(true);
      await createAlquiler.mutateAsync({
        cliente_id: data.cliente_id!,
        videojuego_id: data.videojuego_id!,
        fecha_inicio: toAPIDate(data.fecha_inicio),
        fecha_fin_prevista: toAPIDate(data.fecha_fin_prevista),
        total_pagado: Number(data.total_pagado),
      });

      Alert.alert("Bien", "Alquiler creado correctamente");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[commonS.screen, { padding: 20 }]}>
      <View style={formS.container}>
        <Text style={commonS.sectionTitle}>Nuevo Alquiler</Text>

        {/* CLIENTE */}
        <View style={{ zIndex: 2000 }}> 
          <Controller
            control={control}
            name="cliente_id"
            render={({ field: { onChange, value } }) => (
              <SearchDropdown
                label="Cliente"
                value={value}
                onChange={onChange}
                items={clientes}
                getLabel={(c) => c.nombre}
                keyExtractor={(c) => c.id.toString()}
              />
            )}
          />
        </View>

        {/* VIDEOJUEGO */}
        <View style={{ zIndex: 1000, marginTop: 10 }}>
          <Controller
            control={control}
            name="videojuego_id"
            render={({ field: { onChange, value } }) => (
              <SearchDropdown
                label="Videojuego"
                value={value}
                onChange={onChange}
                items={videojuegos}
                getLabel={(v) => v.titulo}
                keyExtractor={(v) => v.id.toString()}
              />
            )}
          />
        </View>

        {/* FECHAS */}
        <DateRangeInput
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onChangeFechaInicio={(v) => setValue("fecha_inicio", v)}
          onChangeFechaFin={(v) => setValue("fecha_fin_prevista", v)}
        />

        {/* RESUMEN DE ALQUILER */}
        <RentalSummary 
          dias={dias}
          totalAPagar={total}
          videojuegoSeleccionado={videojuego ? {
            titulo: videojuego.titulo,
            precioPorDia: videojuego.precio_alquiler_dia
          } : undefined}
        />

        {/* BOTONES */}
        <View style={formS.buttons}>
          <PrimaryButton
            text={cargando ? "Creando..." : "Crear Alquiler"}
            onPress={handleSubmit(onSubmit)}
          />
          <SecondaryButton text="Cancelar" onPress={() => router.back()} />
        </View>
      </View>
    </ScrollView>
  );
}