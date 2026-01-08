import { Cliente, listClientes, clientes as DATA_MOCK, pedidos } from "../types/mockApi";


// Obtener lista de clientes
export const obtenerClientes = async (): Promise<Cliente[]> => {
  return DATA_MOCK;
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number): Promise<Cliente | undefined> => {
  const lista = DATA_MOCK;
  return lista.find((c) => c.id === id);
};

// Obtener pedidos de cliente
export const obtenerPedidosPorCliente = async (clienteId: number) => { 
    return pedidos.filter((p) => p.clienteId === clienteId); 
};

// Crear cliente
export const crearCliente = async (nuevo: Cliente): Promise<Cliente> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  DATA_MOCK.push(nuevo);
  return nuevo;
};

// Editar cliente
export const actualizarCliente = async (
  id: number,
  datos: Partial<Cliente>
): Promise<Cliente | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = DATA_MOCK.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  DATA_MOCK[index] = { ...DATA_MOCK[index], ...datos };
  return DATA_MOCK[index];
};

// Eliminar cliente
export const eliminarCliente = async (id: number): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = DATA_MOCK.findIndex((c) => c.id === id);
  if (index === -1) return false;

  DATA_MOCK.splice(index, 1);
  return true;
};
