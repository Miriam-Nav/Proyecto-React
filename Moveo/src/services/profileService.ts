import { supabase } from "../config/supabaseClient";
import { User } from "../types/User";

export const uploadUserAvatar = async ({ userId, fileUri }: { userId: number, fileUri: string }): Promise<User> => {
  // Preparar el archivo
  const ext = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `avatar-${userId}-${Date.now()}.${ext}`;

  const response = await fetch(fileUri);
  const blob = await response.blob();

  // Subir al Bucket
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, { upsert: true });

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