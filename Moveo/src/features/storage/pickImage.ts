import * as ImagePicker from 'expo-image-picker'

export async function pickImageFromLibrary() {
  // Solicita permiso para acceder a la galería
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') {
    throw new Error('Permiso de galería denegado')
  }

  // Abre el selector de imágenes del sistema
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  })

  // El usuario puede cancelar la selección
  if (result.canceled) return null

  // Devuelve la imagen seleccionada
  return result.assets[0] // { uri, width, height, fileName, ... }
}