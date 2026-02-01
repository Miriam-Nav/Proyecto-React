import { supabase } from "../config/supabaseClient";

// Obtener todo el catálogo
export const getVideojuegos = async () => {
  const { data, error } = await supabase
    .from('videojuegos')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

// Obtener un juego específico 
export const getVideojuegoById = async (id: string) => {
  const { data, error } = await supabase
    .from('videojuegos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Obtener un juego específico por cliente
export const getVideojuegoByClient = async (id: string) => {
  const { data, error } = await supabase
    .from('videojuegos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};