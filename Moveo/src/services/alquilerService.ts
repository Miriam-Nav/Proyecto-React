import { supabase } from "../config/supabaseClient";
import { Alquiler } from "../types/Alquiler";

export const getAlquileresByCliente = async (clienteId: number): Promise<Alquiler[]> => {
    const { data, error } = await supabase
        .from("alquileres")
        // Trae el objeto del juego automáticamente
        .select("*, videojuego:videojuegos(*)") 
        .eq("cliente_id", clienteId);

    if (error) throw new Error("No se pudieron cargar los alquileres.");
    return data;
};