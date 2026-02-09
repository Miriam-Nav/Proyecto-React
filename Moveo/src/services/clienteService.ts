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

// Comprueba si un email ya existe en la tabla de clientes.
// Si se pasa un excludeId, se ignoramos (para editar).
export const checkEmailDuplicado = async (email: string, excludeId?: number): Promise<boolean> => {
    if (!email) return false;

    let query = supabase
        .from("clientes")
        .select("id")
        .eq("email", email.trim().toLowerCase());

    // Si se está editando
    if (excludeId) {
        query = query.neq("id", excludeId);
    }

    const { data, error } = await query.maybeSingle();
    
    if (error) return false;
    return !!data; // Retorna true si encontró a alguien
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
    // Valida duplicado antes de insertar
    const esDuplicado = await checkEmailDuplicado(payload.email);
    if (esDuplicado) {
        throw new Error("El correo electrónico ya está registrado con otro cliente.");
    }
    
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
    // Validar si el nuevo email ya lo tiene OTRO cliente
    const esDuplicado = await checkEmailDuplicado(payload.email, payload.id);
    if (esDuplicado) {
        throw new Error("El correo electrónico ya está registrado con otro cliente.");
    }

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

export const uploadClienteAvatar = async (clienteId: number, fileUri: string) => {
    const ext = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `client-${clienteId}-${Date.now()}.${ext}`;

    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Subir al bucket 'avatars'
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob);

    if (uploadError) throw uploadError;

    // Obtener URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // Actualizar la tabla clientes
    const { error: updateError } = await supabase
        .from("clientes")
        .update({ avatar_url: publicUrl })
        .eq("id", clienteId);

    if (updateError) throw updateError;
    
    return publicUrl;
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
