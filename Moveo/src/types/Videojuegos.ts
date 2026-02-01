export interface Videojuego {
    id: number;
    titulo: string;
    plataforma: string;
    genero?: string;
    precio_alquiler_dia: number;
    imagen_url?: string;
    stock?: number;
    created_at?: string;
}

export const emptyVideojuego: Videojuego = {
    id: 0,
    titulo: "",
    plataforma: "",
    genero: "",
    precio_alquiler_dia: 0,
    imagen_url: "",
    stock: 0,
};