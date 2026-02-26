import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { deleteCliente, getClienteById, getClientes, updateCliente } from '../services/clienteService';
import { getAlquileresByCliente } from '../services/alquilerService';
import { createCliente } from "../services/clienteService";

// Hook con Realtime para pantalla de inicio
export function useClientesRealtime() {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['clientes'], 
    queryFn: getClientes,
    refetchOnMount: 'always',
    staleTime: 0,
    retry: 3,
  });

  // Suscripción al canal de Realtime
  useEffect(() => {
    const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      console.log('Realtime clientes - evento recibido:', payload.eventType);
      queryClient.invalidateQueries({ 
        queryKey: ['clientes'],
        refetchType: 'active'
      });
    };

    const channel = supabase
      .channel('clientes-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'clientes' 
        },
        applyRealtimeChange
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime clientes CONECTADO');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error en canal Realtime clientes');
          console.error('Verifica que ejecutaste: ALTER PUBLICATION supabase_realtime ADD TABLE clientes;');
        } else if (status === 'CLOSED') {
          console.warn('Canal Realtime clientes CERRADO');
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return result;
}

// Hook para lista de clientes
export function useClientes() {
  return useQuery({
    queryKey: ['clientes'], 
    queryFn: getClientes,
    refetchOnMount: 'always',
    retry: 3,
  });
}

// Obtener un solo cliente
export function useClienteDetalle(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => getClienteById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    refetchOnMount: 'always',
    retry: 3,
  });
}

// Obtener alquileres de un cliente
export function useClienteAlquileres(id: number) {
  return useQuery({
    queryKey: ['alquileres', id],
    queryFn: () => getAlquileresByCliente(id),
    enabled: !!id,
    refetchOnMount: 'always',
    retry: 3,
  });
}


export const useCreateClienteAccion = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: Omit<Cliente, "id" | "created_at">) => createCliente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  return { 
    ejecutarCrear: mutation.mutateAsync,
    cargando: mutation.isPending 
  };
};

export const useUpdateClienteAccion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Cliente }) => updateCliente({ ...data, id }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", variables.id] });
    },
  });

  return { 
    ejecutarActualizar: (id: number, data: Cliente) => mutation.mutateAsync({ id, data }),
    cargando: mutation.isPending 
  };
};

export const useDeleteClienteAccion = () => {
  const queryClient = useQueryClient();

  const ejecutarEliminar = async (id: number) => {
    const res = await deleteCliente(id);
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
    return res;
  };

  return { ejecutarEliminar };
};


export const useUpdateEstadoCliente = () => {
  const queryClient = useQueryClient();

  const ejecutarCambioEstado = async (id: number, nuevoEstado: boolean) => {
    // Obten el cliente actual
    const clienteActual = await getClienteById(id);
    if (!clienteActual) throw new Error("Cliente no encontrado");

    // Actualiza
    const res = await updateCliente({
      ...clienteActual,
      activo: nuevoEstado
    });

    queryClient.invalidateQueries({ queryKey: ["clientes"] });
    queryClient.invalidateQueries({ queryKey: ["cliente", id] });
    
    return res;
  };

  return { ejecutarCambioEstado };
};