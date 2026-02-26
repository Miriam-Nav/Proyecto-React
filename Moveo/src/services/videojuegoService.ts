import { supabase } from "../config/supabaseClient";
import { Videojuego } from "../types/Videojuegos";

// Obtener todo el catálogo
export const getVideojuegos = async () => {
  const { data, error } = await supabase
    .from('videojuegos')
    .select('*')
    .order('titulo', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

// Obtener un juego específico 
export const getVideojuegoById = async (id: string) => {
  const { data, error } = await supabase
    .from('videojuegos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener videojuego:', error);
  }
  return data;
};

// Crear videojuego
export const createVideojuego = async (payload: Omit<Videojuego, "id" | "created_at">): Promise<Videojuego> => {
  const { data, error } = await supabase
    .from("videojuegos")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error al crear videojuego:", error);
    throw new Error(`Error al crear videojuego: ${error.message}`);
  }

  if (!data) {
    throw new Error("No se recibieron datos del videojuego creado.");
  }

  return data;
};

// Editar videojuego
export const updateVideojuego = async (id: number, payload: Partial<Videojuego>): Promise<Videojuego> => {
  const { data, error } = await supabase
    .from("videojuegos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar videojuego:", error);
    throw new Error(`Error al actualizar videojuego: ${error.message}`);
  }

  if (!data) {
    throw new Error("No se recibieron datos del videojuego actualizado.");
  }

  return data;
};

// Eliminar videojuego
export const deleteVideojuego = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("videojuegos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar videojuego:", error);
    throw new Error(`Error al eliminar videojuego: ${error.message}`);
  }
};