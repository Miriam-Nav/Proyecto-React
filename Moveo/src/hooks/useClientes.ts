import { useQuery } from '@tanstack/react-query';
import { deleteCliente, getClienteById, getClientes, updateCliente } from '../services/clienteService';
import { getAlquileresByCliente } from '../services/alquilerService';
import { useQueryClient } from "@tanstack/react-query";
import { createCliente } from "../services/clienteService";

// Listar todos los clientes
export function useClientes() {
  return useQuery({
    queryKey: ['clientes'], 
    queryFn: getClientes,
    // Forzar refetch en mount para asegurar datos frescos
    refetchOnMount: 'always',
    // Reintentar en caso de error inicial
    retry: 3,
  });
}

// Obtener un solo cliente
export function useClienteDetalle(id: number) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => getClienteById(id),
    enabled: !!id,
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


export const useNuevoClienteAccion = () => {
  const queryClient = useQueryClient();

  const ejecutarCrear = async (data: any) => {
    const res = await createCliente(data);
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
    return res;
  };

  return { ejecutarCrear };
};

export const useUpdateClienteAccion = () => {
  const queryClient = useQueryClient();

  const ejecutarActualizar = async (id: number, data: any) => {
    const res = await updateCliente({ ...data, id }); 
    
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
    queryClient.invalidateQueries({ queryKey: ["cliente", id] });
    return res;
  };

  return { ejecutarActualizar };
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