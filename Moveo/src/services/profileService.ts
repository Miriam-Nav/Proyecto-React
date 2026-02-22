import { supabase } from "../config/supabaseClient";
import { User } from "../types/User";
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const uploadUserAvatar = async ({ userId, fileUri }: { userId: number, fileUri: string }): Promise<User> => {
  // Preparar el archivo
  const ext = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `avatar-${userId}-${Date.now()}.${ext}`;

  // Leer el archivo como Base64 usando expo-file-system legacy
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: 'base64',
  });

  // Convertir Base64 a ArrayBuffer
  const arrayBuffer = decode(base64);

  // Determinar el tipo MIME según la extensión
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

  // Subir al Bucket usando ArrayBuffer
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, { 
      contentType,
      upsert: true 
    });

  if (uploadError) throw uploadError;

  // Obtener URL Pública
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Actualizar la tabla 'users' y retornar el usuario completo
  const { data, error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  // Retornar mapeado al formato de tu Store
  return {
    id: data.id,
    roleId: data.role_id,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatar_url,
  };
};