import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { Alquiler } from "../types/Alquiler";
import {
    alquileresQueryKey,
    getAllAlquileres,
    createAlquiler,
} from "../services/alquilerService";

// Hook con Realtime para pantalla de inicio
export function useAlquileresRealtime() {
    const queryClient = useQueryClient();

    const { data: alquileres = [], isLoading, error, refetch } = useQuery({
        queryKey: alquileresQueryKey,
        queryFn: getAllAlquileres,
        refetchOnMount: 'always',
        retry: 3,
    });

    // Suscripción al canal de Realtime
    useEffect(() => {
        const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            // Invalidar para refetch (incluye datos de joins)
            queryClient.invalidateQueries({ 
                queryKey: alquileresQueryKey,
                refetchType: 'active'
            });
        };

        const channel = supabase
            .channel('alquileres-realtime')
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'alquileres' 
                },
                applyRealtimeChange
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Realtime alquileres CONECTADO');
                }
            });

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return {
        alquileres,
        isLoading,
        error,
        refetch,
    };
}

// Hook para lista de alquileres
export function useAlquileres() {
    const { data: alquileres = [], isLoading, error, refetch } = useQuery({
        queryKey: alquileresQueryKey,
        queryFn: getAllAlquileres,
        refetchOnMount: 'always',
        retry: 3,
    });

    return {
        alquileres,
        isLoading,
        error,
        refetch,
    };
}

// Hook para crear alquiler
export function useCreateAlquiler() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAlquiler,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
        },
    });
}



