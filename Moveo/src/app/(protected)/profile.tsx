import React, { useContext, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserStore } from "../../stores/user.store";
import { commonStyles } from "../../styles/common.styles";
import { formStyles } from "../../styles/form.styles";
import { AuthContext } from "../../providers/AuthProvider";
import { CustomHeader } from "../../components/HeaderApp";
import { PrimaryButton, SecondaryButton } from "../../components/ButtonApp";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const commonS = commonStyles(theme);
  const formS = formStyles(theme);

  const { logOut } = useContext(AuthContext);

  // Datos de Zustand
  const { user, role, token, setUser } = useUserStore();
  
  // Estado local para el formulario
  const [nombre, setNombre] = useState(user?.name || "");

  const handleUpdate = () => {
    if (user && role && token) {
      setUser({ ...user, name: nombre }, role, token);
    }
  };

  return (
    <ScrollView style={commonS.screen}>
      {/* HEADER con Flecha */}
      <CustomHeader title="Mi Perfil"/>

      {/* AVATAR Y ROL */}
      <View style={[formS.container, { alignItems: 'center' }]}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.substring(0, 2).toUpperCase() || "US"} 
          style={{ backgroundColor: theme.colors.primary, marginBottom: 15 }}
          labelStyle={{ fontFamily: 'monospace' }}
        />
        <Text style={commonS.labelColor}>ROL ACTUAL: {role?.name}</Text>
      </View>

      {/* FORMULARIO DE EDICIÓN */}
      <View style={formS.container}>
        <Text style={commonS.sectionTitle}>EDITAR DATOS</Text>

        <Text style={commonS.labelColor}>Nombre de usuario</Text>
        <TextInput
          mode="outlined"
          value={nombre}
          onChangeText={setNombre}
          style={formS.input}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />

        <Text style={commonS.labelColor}>Email</Text>
        <TextInput
          mode="outlined"
          value={user?.email}
          disabled
          style={[formS.input, { opacity: 0.7 }]}
          outlineStyle={formS.inputOutline}
          contentStyle={formS.inputContent}
        />

        {/* BOTÓN GUARDAR*/}
        <View style={{ marginTop: 10 }}>
          <PrimaryButton text={"GUARDAR CAMBIOS"} onPress={handleUpdate}/>
        </View>
      </View>

      {/* BOTÓN CERRAR SESIÓN */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <SecondaryButton text={"CERRAR SESIÓN "} onPress={logOut} color={theme.colors.error}/>
      </View>
    </ScrollView>
  );
}