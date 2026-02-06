import { supabase } from "../../config/supabaseClient"

function getExtFromUri(uri: string) {
  const parts = uri.split('.')
  const ext = parts[parts.length - 1]
  return ext?.toLowerCase() || 'jpg'
}

export async function uploadAvatar(uri: string, userId: string) {
  const ext = getExtFromUri(uri)

  // Ruta del archivo dentro del bucket (carpeta por usuario)
  const path = `${userId}/${Date.now()}.${ext}`

  // Lee el archivo local y lo convierte a ArrayBuffer
  const res = await fetch(uri)
  const arrayBuffer = await res.arrayBuffer()

  // Sube el archivo a Supabase Storage
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      upsert: false,
    })

  if (error) throw error

  // Devuelve la ruta del archivo almacenado
  return data.path
}