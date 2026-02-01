export interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    avatar_url?: string;
    notas?: string;
    activo: boolean;
    direccion: string;
    created_at?: string;
}

export const emptyCliente: Cliente = {
    id: 0,
    nombre: "",
    email: "",
    telefono: "",
    avatar_url: "",
    notas: "",
    activo: true,
    direccion: "",
};