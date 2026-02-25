import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { getVideojuegos, getVideojuegoById } from "../services/videojuegoService";

// Query key
export const videojuegosQueryKey = ['videojuegos'] as const;

// Hook con Realtime para pantalla de inicio
export function useVideojuegosRealtime() {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: videojuegosQueryKey,
        queryFn: getVideojuegos,
        refetchOnMount: 'always',
        retry: 3,
    });

    // Suscripción al canal de Realtime
    useEffect(() => {
        const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
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
export function useVideojuegoById(id: string) {
    return useQuery({
        queryKey: [...videojuegosQueryKey, id],
        queryFn: () => getVideojuegoById(id),
        enabled: !!id,
        refetchOnMount: 'always',
        retry: 3,
    });
}
