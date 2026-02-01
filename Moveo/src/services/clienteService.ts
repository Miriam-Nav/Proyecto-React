import { supabase } from "../config/supabaseClient";
import { Cliente } from "../types/Clientes";

type ClienteRow = {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    avatar_url: string | null;
    notas: string | null;
    activo: boolean;
    direccion: string | null;
    created_at: string | null;
};

const mapCliente = (row: ClienteRow): Cliente => {
    return {
        id: row.id,
        nombre: row.nombre,
        email: row.email,
        telefono: row.telefono ?? undefined,
        avatar_url: row.avatar_url ?? undefined,
        notas: row.notas ?? undefined,
        activo: row.activo,
        direccion: row.direccion ?? "",
        created_at: row.created_at ?? undefined,
    };
};

// Obtener lista de clientes
export const getClientes = async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
        .from("clientes")
        .select("*");

    if (error || !data) {
        throw new Error("No se pudieron cargar los clientes.");
    }

    return data.map(mapCliente);
};

// Obtener cliente por ID
export const getClienteById = async (id: number): Promise<Cliente | undefined> => {
    const { data, error } = await supabase
        .from("clientes")
        .select("id, nombre, email, telefono, avatar_url, notas, activo, direccion, created_at")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error("No se pudo cargar el cliente.");
    }

    return data ? mapCliente(data) : undefined;
};


// Crear cliente
// Acepta todo lo de Cliente excepto el id y el created_at
export const createCliente = async (payload: Omit<Cliente, "id" | "created_at">): Promise<Cliente> => {
    const { data, error } = await supabase
        .from("clientes")
        .insert(payload) 
        .select()
        .single();

    if (error || !data) throw new Error("No se pudo crear el cliente.");

    return mapCliente(data);
};

// Editar cliente
export const updateCliente = async (payload: Cliente): Promise<Cliente | undefined> => {
    const { error: updateError } = await supabase
        .from("clientes")
        .update({
            nombre: payload.nombre,
            email: payload.email,
            telefono: payload.telefono ?? null,
            avatar_url: payload.avatar_url ?? null,
            notas: payload.notas ?? null,
            activo: payload.activo,
            direccion: payload.direccion,
        })
        .eq("id", payload.id);

    if (updateError) {
        throw new Error("No se pudo guardar el cliente.");
    }

    return getClienteById(payload.id);
};


// Eliminar cliente
export const deleteCliente = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error("No se pudo eliminar el cliente.");
    }

    return true;
};
