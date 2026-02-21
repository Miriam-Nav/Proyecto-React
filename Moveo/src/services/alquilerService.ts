import { supabase } from "../config/supabaseClient";
import { Alquiler } from "../types/Alquiler";

// Query key para React Query
export const alquileresQueryKey = ['alquileres'] as const;

// Obtener todos los alquileres con detalles de cliente y videojuego
export const getAllAlquileres = async (): Promise<Alquiler[]> => {
    const { data, error } = await supabase
        .from("alquileres")
        .select(`
            *,
            videojuego:videojuegos(*),
            cliente:clientes(id, nombre, email, telefono, avatar_url)
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error("No se pudieron cargar los alquileres.");
    return data as Alquiler[];
};

// Obtener alquileres por cliente
export const getAlquileresByCliente = async (clienteId: number): Promise<Alquiler[]> => {
    const { data, error } = await supabase
        .from("alquileres")
        .select("*, videojuego:videojuegos(*)") 
        .eq("cliente_id", clienteId)
        .order('created_at', { ascending: false });

    if (error) throw new Error("No se pudieron cargar los alquileres.");
    return data as Alquiler[];
};

// Obtener alquiler por ID
export const getAlquilerById = async (id: number): Promise<Alquiler | null> => {
    const { data, error } = await supabase
        .from("alquileres")
        .select(`
            *,
            videojuego:videojuegos(*),
            cliente:clientes(id, nombre, email, telefono, avatar_url)
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw new Error("No se pudo cargar el alquiler.");
    return data as Alquiler | null;
};

// Crear nuevo alquiler
export const createAlquiler = async (input: {
    cliente_id: number;
    videojuego_id: number;
    fecha_inicio: string;
    fecha_fin_prevista: string;
    total_pagado: number;
}): Promise<Alquiler> => {
    const { data, error } = await supabase
        .from("alquileres")
        .insert({
            cliente_id: input.cliente_id,
            videojuego_id: input.videojuego_id,
            fecha_inicio: input.fecha_inicio,
            fecha_fin_prevista: input.fecha_fin_prevista,
            estado: "activo",
            total_pagado: input.total_pagado,
        })
        .select(`
            *,
            videojuego:videojuegos(*),
            cliente:clientes(id, nombre, email, telefono, avatar_url)
        `)
        .single();

    if (error) throw new Error(error.message || "No se pudo crear el alquiler.");
    return data as Alquiler;
};

// Actualizar estado del alquiler
export const updateAlquilerEstado = async (id: number, estado: string): Promise<void> => {
    const { error } = await supabase
        .from("alquileres")
        .update({ estado })
        .eq("id", id);

    if (error) throw new Error("No se pudo actualizar el estado del alquiler.");
};

// Eliminar alquiler
export const deleteAlquiler = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from("alquileres")
        .delete()
        .eq("id", id);

    if (error) throw new Error("No se pudo eliminar el alquiler.");
};