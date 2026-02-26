import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { getVideojuegos, getVideojuegoById, createVideojuego, updateVideojuego, deleteVideojuego } from "../services/videojuegoService";
import { Videojuego } from "../types/Videojuegos";

// Query key
export const videojuegosQueryKey = ['videojuegos'] as const;

// Hook con Realtime para pantalla de inicio
export function useVideojuegosRealtime() {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: videojuegosQueryKey,
        queryFn: getVideojuegos,
        refetchOnMount: 'always',
        staleTime: 0,
        retry: 3,
    });

    // Suscripción al canal de Realtime
    useEffect(() => {
        const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            console.log('Realtime videojuegos - evento recibido:', payload.eventType);
            queryClient.invalidateQueries({ 
                queryKey: videojuegosQueryKey,
                refetchType: 'active'
            });
        };

        const channel = supabase
            .channel('videojuegos-realtime')
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'videojuegos' 
                },
                applyRealtimeChange
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Realtime videojuegos CONECTADO');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Error en canal Realtime videojuegos');
                    console.error('Verifica que ejecutaste: ALTER PUBLICATION supabase_realtime ADD TABLE videojuegos;');
                } else if (status === 'CLOSED') {
                    console.warn('Canal Realtime videojuegos CERRADO');
                }
            });

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return result;
}

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
export function useVideojuegoById(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...videojuegosQueryKey, id],
        queryFn: () => getVideojuegoById(id),
        enabled: options?.enabled !== undefined ? options.enabled : !!id,
        refetchOnMount: 'always',
        retry: 3,
    });
}

// Hook para crear videojuego
export function useCreateVideojuego() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<Videojuego, "id" | "created_at">) => createVideojuego(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: videojuegosQueryKey });
        },
    });
}

// Hook para actualizar videojuego
export function useUpdateVideojuego() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<Videojuego> }) => 
            updateVideojuego(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: videojuegosQueryKey });
            queryClient.invalidateQueries({ queryKey: [...videojuegosQueryKey, variables.id.toString()] });
        },
    });
}

// Hook para eliminar videojuego
export function useDeleteVideojuego() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteVideojuego(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: videojuegosQueryKey });
        },
    });
}
