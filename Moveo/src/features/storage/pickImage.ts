import * as ImagePicker from "expo-image-picker";

export async function pickImageFromLibrary() {
  // Permisos
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permiso de galería denegado");
  }

  // Abrir galería
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // El editor de Expo fuerza la recompresión de la imagen
    allowsEditing: true, 
    aspect: [1, 1], 
    // Baja ligeramente la calidad (de 1.0 a 0.8)
    quality: 0.8, 
  });

  // Cancelado
  if (result.canceled) return null;

  const asset = result.assets[0];

  // Normalizar el formato
  // Fuerza el tipo 'image/jpeg' aunque el original sea otra cosa. 
  // Esto es lo que se usará luego en el FormData para que Supabase lo acepte bien.
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    // Fuerza siempre JPEG aquí
    type: "image/jpeg",  
    // Asegura que el nombre termine en .jpg
    fileName: asset.fileName || `upload_${Date.now()}.jpg`, 
  };
}