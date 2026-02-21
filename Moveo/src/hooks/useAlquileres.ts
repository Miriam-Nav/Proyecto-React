import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { Alquiler } from "../types/Alquiler";
import {
    alquileresQueryKey,
    getAllAlquileres,
    createAlquiler,
    updateAlquilerEstado,
    deleteAlquiler,
} from "../services/alquilerService";

// Hook principal con Realtime
export function useAlquileresRealtime() {
    const queryClient = useQueryClient();
    const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('CONNECTING');

    // Query principal
    const { data: alquileres = [], isLoading, error, refetch } = useQuery({
        queryKey: alquileresQueryKey,
        queryFn: getAllAlquileres,
        // Forzar refetch en mount para asegurar datos frescos
        refetchOnMount: 'always',
        // Reintentar en caso de error inicial
        retry: 3,
        // Delay corto entre reintentos
        retryDelay: 1000,
    });

    // Configurar Realtime
    useEffect(() => {
        // Mantener el token de autenticación actualizado
        void supabase.auth.getSession().then(({ data }) => {
            const token = data.session?.access_token;
            if (token) {
                supabase.realtime.setAuth(token);
            }
        });

        const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
            const token = session?.access_token;
            if (token) {
                supabase.realtime.setAuth(token);
            }
        });

        return () => {
            authSubscription.subscription.unsubscribe();
        };
    }, []);

    // Suscripción al canal de Realtime
    useEffect(() => {
        setRealtimeStatus('CONNECTING');

        const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            console.log('Realtime event received:', payload.eventType, payload);
            
            queryClient.setQueryData<Alquiler[]>(alquileresQueryKey, (current = []) => {
                const next = [...current];

                if (payload.eventType === 'DELETE') {
                    const deletedId = Number(payload.old.id);
                    return next.filter((item) => item.id !== deletedId);
                }

                // Para INSERT y UPDATE, necesita refetch porque los datos incluyen joins
                // que no vienen en el payload de Realtime (videojuego y cliente completos)
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    // Invalidar queries para que React Query haga refetch automáticamente
                    queryClient.invalidateQueries({ 
                        queryKey: alquileresQueryKey,
                        refetchType: 'active'
                    });
                    return current;
                }

                return current;
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
                console.log('🔵 Realtime subscription status:', status);
                if (status === 'SUBSCRIBED') {
                    setRealtimeStatus('CONNECTED');
                    console.log('Realtime CONECTADO - Los cambios se verán en tiempo real');
                    // Sincronizar datos al conectarse exitosamente
                    queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
                } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    setRealtimeStatus('DISCONNECTED');
                    console.log('Realtime DESCONECTADO - Verifica la configuración');
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
        realtimeStatus,
    };
}

// Hook para crear alquiler
export function useCreateAlquiler() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAlquiler,
        onSuccess: () => {
            // Invalidar para refrescar la lista
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
        },
    });
}

// Hook para actualizar estado
export function useUpdateAlquilerEstado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: string }) =>
            updateAlquilerEstado(id, estado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
        },
    });
}

// Hook para eliminar alquiler
export function useDeleteAlquiler() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAlquiler,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alquileresQueryKey });
        },
    });
}
