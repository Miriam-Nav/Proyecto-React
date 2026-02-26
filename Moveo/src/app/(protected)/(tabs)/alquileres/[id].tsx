import { View, ScrollView, ActivityIndicator } from "react-native";
import { Text, useTheme, SegmentedButtons, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlquilerSchema, AlquilerFormValues } from "../../../../schemas/alquiler.schema";
import { useClientes } from "../../../../hooks/useClientes";
import { useVideojuegos } from "../../../../hooks/useVideojuegos";
import { useAlquilerById, useUpdateAlquiler } from "../../../../hooks/useAlquileres";
import { DateRangeInput, toAPIDate, diffDays, isValidDate } from "../../../../components/DateInputField"; 
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { RentalSummary } from "../../../../components/RentalSummary"; 
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { useState, useEffect } from "react";
import { SearchDropdown } from "@/components/SearchDropdown";

export default function EditarAlquiler() {
  const theme = useTheme();
  const router = useRouter();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: clientes = [] } = useClientes();
  const { data: videojuegos = [] } = useVideojuegos();
  const { data: alquiler, isLoading } = useAlquilerById(Number(id));
  const updateAlquiler = useUpdateAlquiler();

  const [cargando, setCargando] = useState(false);
  const [estadoAlquiler, setEstadoAlquiler] = useState("activo");
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } =
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

  // Cargar datos del alquiler cuando estén disponibles
  useEffect(() => {
    if (alquiler) {
      // Convertir de yyyy-mm-dd a dd/mm/yyyy
      const convertirFecha = (fechaISO: string | undefined) => {
        if (!fechaISO || typeof fechaISO !== 'string') return '';
        // Si ya está en formato dd/mm/yyyy, devolverla así
        if (fechaISO.includes('/')) return fechaISO;
        // Convertir de yyyy-mm-dd a dd/mm/yyyy
        const [year, month, day] = fechaISO.split('-');
        return `${day}/${month}/${year}`;
      };
      
      reset({
        cliente_id: alquiler.cliente_id,
        videojuego_id: alquiler.videojuego_id,
        fecha_inicio: convertirFecha(alquiler.fecha_inicio),
        fecha_fin_prevista: convertirFecha(alquiler.fecha_fin_prevista),
        total_pagado: alquiler.total_pagado,
      });
      setEstadoAlquiler(alquiler.estado);
    }
  }, [alquiler, reset]);

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
      
      // Convertir fechas de dd/mm/yyyy a yyyy-mm-dd para la API
      const convertirParaAPI = (fechaFormato: string) => {
        const [day, month, year] = fechaFormato.split('/');
        return `${year}-${month}-${day}`;
      };
      
      console.log('Estado a guardar:', estadoAlquiler);
      console.log('Datos del formulario:', data);
      
      const payload = {
        cliente_id: data.cliente_id,
        videojuego_id: data.videojuego_id,
        fecha_inicio: convertirParaAPI(data.fecha_inicio),
        fecha_fin_prevista: convertirParaAPI(data.fecha_fin_prevista),
        total_pagado: data.total_pagado,
        estado: estadoAlquiler,
      };
      
      console.log('Payload completo:', payload);
      
      await updateAlquiler.mutateAsync({
        id: Number(id),
        payload,
      });
      
      setSnackbar({ visible: true, message: 'Alquiler actualizado correctamente', type: 'success' });
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el alquiler';
      setSnackbar({ visible: true, message: errorMessage, type: 'error' });
      console.error("Error al actualizar:", error);
    } finally {
      setCargando(false);
    }
  };

  if (isLoading) {
    console.log('Cargando alquiler con ID:', id);
    return (
      <View style={[commonS.screen, commonS.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando alquiler...</Text>
      </View>
    );
  }

  if (!alquiler) {
    console.log('Alquiler no encontrado para ID:', id);
    return (
      <View style={[commonS.screen, commonS.center]}>
        <Text>Alquiler no encontrado</Text>
        <SecondaryButton text="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  
  console.log('Alquiler cargado:', alquiler);

  return (
    <ScrollView style={commonS.screen} contentContainerStyle={{  paddingHorizontal: 0, paddingTop: 20, paddingBottom: 40 }}>
      <View style={formS.container}>
        <Text style={commonS.sectionTitle}>Editar Alquiler</Text>

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

        {/* SELECTOR DE ESTADO */}
        <View style={{ marginVertical: 10 }}>
          <Text style={{ 
            fontFamily: "monospace", 
            fontSize: 12, 
            color: theme.colors.onSurfaceVariant,
            marginBottom: 8 
          }}>
            Estado del Alquiler
          </Text>
          <SegmentedButtons
            value={estadoAlquiler}
            onValueChange={setEstadoAlquiler}
            buttons={[
              {
                value: 'activo',
                label: 'Activo',
                icon: 'clock-outline',
              },
              {
                value: 'finalizado',
                label: 'Finalizado',
                icon: 'check-circle-outline',
              },
              {
                value: 'retrasado',
                label: 'Retrasado',
                icon: 'alert-circle-outline',
              },
            ]}
          />
        </View>

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
            text={cargando ? "Guardando..." : "Guardar"}
            onPress={handleSubmit(onSubmit)}
          />
          <SecondaryButton text="Cancelar" onPress={() => router.back()} />
        </View>
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        wrapperStyle={{ width: '100%', alignSelf: 'center' }}
        style={{ backgroundColor: snackbar.type === 'error' ? theme.colors.error : theme.colors.onError }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}
