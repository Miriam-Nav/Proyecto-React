import { useQuery } from "@tanstack/react-query";
import { getVideojuegos, getVideojuegoById } from "../services/videojuegoService";

// Query key
export const videojuegosQueryKey = ['videojuegos'] as const;

// Hook para obtener todos los videojuegos
export function useVideojuegos() {
    return useQuery({
        queryKey: videojuegosQueryKey,
        queryFn: getVideojuegos,
        refetchOnMount: 'always',
        retry: 3,
    });
}

// Hook para obtener un videojuego por ID
export function useVideojuegoById(id: string) {
    return useQuery({
        queryKey: [...videojuegosQueryKey, id],
        queryFn: () => getVideojuegoById(id),
        enabled: !!id,
        refetchOnMount: 'always',
        retry: 3,
    });
}
