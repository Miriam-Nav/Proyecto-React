import { Videojuego } from "./Videojuegos";
import { Cliente } from "./Clientes";

export interface Alquiler {
    id: number;
    cliente_id: number;
    videojuego_id: number;
    fecha_inicio: string;
    fecha_fin_prevista: string;
    estado: string;
    total_pagado: number;
    videojuego?: Videojuego;
    cliente?: Cliente;
}

export const emptyAlquiler: Alquiler = {
    id: 0,
    cliente_id: 0,
    videojuego_id: 0,
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin_prevista: "",
    estado: "pendiente",
    total_pagado: 0,
};