// @ts-ignore
import { supabase } from '@/config/supabaseClient';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';


// Pillam las variables de entorno
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const uploadUserAvatar = async ({ userId, fileUri }: { userId: string, fileUri: string }) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Faltan las variables de entorno de Supabase");
    }

    // Leer archivo como Base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });

    // Convertir a ArrayBuffer
    const arrayBuffer = decode(base64);
    const fileName = `avatar-${userId}-${Date.now()}.jpg`;

    // SUBIDA MANUAL vía Fetch
    // URL: URL_PROYECTO/storage/v1/object/NOMBRE_BUCKET/NOMBRE_ARCHIVO
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/avatars/${fileName}`;
    
    console.log("Intentando subir a:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-upsert': 'true',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la subida al Storage");
    }

    // Obtener URL pública usando el SDK
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Actualizar la tabla de usuarios
    const { data: updatedUser, error: dbError } = await supabase
      .from('usuarios') 
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (dbError) throw dbError;

    return updatedUser;
  } catch (error: any) {
    console.error("ERROR EN UPLOAD SERVICE:", error);
  }
};