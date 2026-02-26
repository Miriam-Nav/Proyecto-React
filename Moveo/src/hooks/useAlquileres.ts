import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { Alquiler } from "../types/Alquiler";
import {
    alquileresQueryKey,
    getAllAlquileres,
    getAlquilerById,
    createAlquiler,
    updateAlquilerEstado,
    updateAlquiler,
    deleteAlquiler,
} from "../services/alquilerService";

// Hook con Realtime para pantalla de inicio
export function useAlquileresRealtime() {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: alquileresQueryKey,
        queryFn: getAllAlquileres,
        refetchOnMount: 'always',
        staleTime: 0,
        retry: 3,
    });

    // Suscripción al canal de Realtime
    useEffect(() => {
        const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            console.log('Realtime alquileres - evento recibido:', payload.eventType);
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
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Error en canal Realtime alquileres');
                    console.error('Verifica que ejecutaste: ALTER PUBLICATION supabase_realtime ADD TABLE alquileres;');
                } else if (status === 'CLOSED') {
                    console.warn('Canal Realtime alquileres CERRADO');
                }
            });

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return result;
}

// Hook para lista de alquileres (sin Realtime)
export function useAlquileres() {
    return useQuery({
        queryKey: alquileresQueryKey,
        queryFn: getAllAlquileres,
        refetchOnMount: 'always',
        retry: 3,
    });
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

// Hook para obtener un alquiler por ID
export function useAlquilerById(id: number) {
    return useQuery({
        queryKey: [...alquileresQueryKey, id],
        queryFn: () => getAlquilerById(id),
        enabled: !!id,
        refetchOnMount: 'always',
        retry: 3,
    });
}

// Hook para actualizar estado de alquiler
export function useUpdateAlquilerEstado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: string }) => 
            updateAlquilerEstado(id, estado),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
            queryClient.invalidateQueries({ queryKey: [...alquileresQueryKey, variables.id] });
        },
    });
}

// Hook para actualizar alquiler completo
export function useUpdateAlquiler() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<Alquiler> }) => 
            updateAlquiler(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
            queryClient.invalidateQueries({ queryKey: [...alquileresQueryKey, variables.id] });
        },
    });
}

// Hook para eliminar alquiler
export function useDeleteAlquiler() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteAlquiler(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
        },
    });
}



