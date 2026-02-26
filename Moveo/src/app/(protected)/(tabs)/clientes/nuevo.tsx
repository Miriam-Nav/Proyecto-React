import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { ActivityIndicator, Text, useTheme, Snackbar } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Componentes y hooks
import { ClienteFormValues, ClienteSchema } from "../../../../schemas/cliente.schema";
import { useClienteDetalle, useUpdateClienteAccion, useCreateClienteAccion } from "../../../../hooks/useClientes";
import { ControlledTextInput } from "../../../../components/ControlledTextInput";
import { PrimaryButton, SecondaryButton } from "../../../../components/ButtonApp";

// Estilos
import { commonStyles } from "../../../../styles/common.styles";
import { formStyles } from "../../../../styles/form.styles";

export default function ClienteFormScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

  // Detectar si es edición o creación
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id && id !== "nuevo";
  const idNum = isEditing ? Number(id) : null;

  // Hooks de acciones
  const { ejecutarActualizar, cargando: actualizando } = useUpdateClienteAccion();
  const { ejecutarCrear, cargando: creando } = useCreateClienteAccion();
  const { data: cliente, isLoading: cargandoDatos } = useClienteDetalle(idNum ?? 0, {
    enabled: isEditing,
  });
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  // Configuración del formulario con Hook Form
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: { nombre: "", email: "", telefono: "", direccion: "" },
  });

  // Resetear el formulario cuando llegan los datos del cliente (Edición)
  useEffect(() => {
    if (isEditing && cliente) {
      reset({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
      });
    }
  }, [cliente, isEditing]);

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      if (isEditing && idNum) {
        await ejecutarActualizar(idNum, data);
        setSnackbar({ visible: true, message: 'Cliente actualizado correctamente', type: 'success' });
      } else {
        await ejecutarCrear(data);
        setSnackbar({ visible: true, message: 'Cliente creado correctamente', type: 'success' });
      }
      setTimeout(() => router.back(), 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un fallo';
      setSnackbar({ visible: true, message: errorMessage, type: 'error' });
    }
  };

  // Pantalla de carga solo si se espera datos de un cliente existente
  if (isEditing && cargandoDatos) {
    return (
      <View style={commonS.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={commonS.screen} contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 20, paddingBottom: 40 }}>
      <View style={formS.container}>
        <Text style={[commonS.sectionTitle, { textAlign: "center", marginBottom: 20 }]}>
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </Text>

        {/* NOMBRE */}
        <ControlledTextInput
          control={control}
          name="nombre"
          label="Nombre completo"
          placeholder="Nombre y apellidos del cliente"
          errors={errors}
          titleInput={true}
        />

        {/* EMAIL */}
        <ControlledTextInput
          control={control}
          name="email"
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          errors={errors}
          titleInput={true}
        />

        {/* TELÉFONO */}
        <ControlledTextInput
          control={control}
          name="telefono"
          label="Teléfono"
          placeholder="Número de teléfono"
          errors={errors}
          titleInput={true}
        />

        {/* DIRECCIÓN */}
        <ControlledTextInput
          control={control}
          name="direccion"
          label="Dirección"
          placeholder="Dirección completa"
          errors={errors}
          titleInput={true}
        />

        <View style={formS.buttons}>
          <PrimaryButton 
            onPress={handleSubmit(onSubmit)} 
            text={actualizando || creando ? "Guardando..." : (isEditing ? "Actualizar" : "Crear")}
            disabled={actualizando || creando}
          />
          
          <SecondaryButton 
            onPress={() => router.back()} 
            text="Cancelar" 
            disabled={actualizando || creando}
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