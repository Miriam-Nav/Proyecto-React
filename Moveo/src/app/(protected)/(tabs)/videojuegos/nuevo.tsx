import { Text, useTheme, Snackbar, ActivityIndicator } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";
import { ControlledTextInput } from "../../../../components/ControlledTextInput";
import { VideojuegoFormValues, VideojuegoSchema } from "../../../../schemas/videojuego.schema";
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";
import { useCreateVideojuego, useVideojuegoById, useUpdateVideojuego } from "../../../../hooks/useVideojuegos";
import { useState, useEffect } from "react";

export default function VideojuegoForm() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);
  const { id } = useLocalSearchParams<{ id?: string }>();
  
  const isEditing = !!id;

  const [cargando, setCargando] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  
  const createVideojuego = useCreateVideojuego();
  const updateVideojuego = useUpdateVideojuego();
  const { data: videojuego, isLoading } = useVideojuegoById(id!, { enabled: isEditing });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<VideojuegoFormValues>({
    resolver: zodResolver(VideojuegoSchema),
    defaultValues: {
      titulo: "",
      plataforma: "",
      genero: "",
      precio_alquiler_dia: 0,
      stock: 0,
    },
  });

  // Cargar datos del videojuego cuando estén disponibles (modo edición)
  useEffect(() => {
    if (isEditing && videojuego) {
      reset({
        titulo: videojuego.titulo,
        plataforma: videojuego.plataforma,
        genero: videojuego.genero || "",
        precio_alquiler_dia: videojuego.precio_alquiler_dia,
        stock: videojuego.stock || 0,
      });
    }
  }, [videojuego, reset, isEditing]);

  const onSubmit = async (data: VideojuegoFormValues) => {
    try {
      setCargando(true);
      
      const payload = {
        titulo: data.titulo,
        plataforma: data.plataforma,
        genero: data.genero || "",
        precio_alquiler_dia: data.precio_alquiler_dia,
        stock: data.stock || 0,
      };

      if (isEditing) {
        await updateVideojuego.mutateAsync({
          id: Number(id),
          payload,
        });
        setSnackbar({ visible: true, message: `Videojuego "${data.titulo}" actualizado correctamente`, type: 'success' });
      } else {
        await createVideojuego.mutateAsync(payload);
        setSnackbar({ visible: true, message: `Videojuego "${data.titulo}" creado correctamente`, type: 'success' });
      }
      
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el videojuego';
      setSnackbar({ 
        visible: true, 
        message: errorMessage, 
        type: 'error' 
      });
      console.log("Error: " + errorMessage);
    } finally {
      setCargando(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <View style={[commonS.screen, commonS.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonS.loadingText}>Cargando videojuego...</Text>
      </View>
    );
  }

  if (isEditing && !videojuego) {
    return (
      <View style={[commonS.screen, commonS.center]}>
        <Text>Videojuego no encontrado</Text>
        <SecondaryButton text="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={commonS.screen} contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 20, paddingBottom: 40 }}>
      <View style={[formS.container]}>
        <Text style={[commonS.sectionTitle, { textAlign: "center" }]}>
          {isEditing ? "Editar Videojuego" : "Nuevo Videojuego"}
        </Text>

        {/* -------- TÍTULO -------- */}
        <ControlledTextInput
          control={control}
          name="titulo"
          label="Título"
          placeholder="Título del videojuego"
          errors={errors}
          titleInput={true}
        />

        {/* -------- PLATAFORMA -------- */}
        <ControlledTextInput
          control={control}
          name="plataforma"
          label="Plataforma"
          placeholder="Plataforma (Ej: PlayStation 5, Xbox, PC)"
          errors={errors}
          titleInput={true}
        />

        {/* -------- GÉNERO -------- */}
        <ControlledTextInput
          control={control}
          name="genero"
          label="Género"
          placeholder="Género (Ej: Acción, Aventura, RPG)"
          errors={errors}
          titleInput={true}
        />

        {/* -------- PRECIO POR DÍA -------- */}
        <ControlledTextInput
          control={control}
          name="precio_alquiler_dia"
          label="Precio por día (€)"
          placeholder="Precio por día (€)"
          errors={errors}
          titleInput={true}
        />

        {/* -------- STOCK -------- */}
        <ControlledTextInput
          control={control}
          name="stock"
          label="Stock disponible"
          placeholder="Cantidad disponible (opcional)"
          errors={errors}
          titleInput={true}
        />

        {/* -------- BOTONES -------- */}
        <View style={formS.buttons}>
          <PrimaryButton 
            onPress={handleSubmit(onSubmit)} 
            text={cargando ? "Guardando..." : (isEditing ? "Actualizar" : "Crear")}
            disabled={cargando}
          />
          
          <SecondaryButton 
            onPress={() => router.back()} 
            text="Cancelar" 
            disabled={cargando}
          />
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
