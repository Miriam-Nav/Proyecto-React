import { Cliente, listClientes, clientes as DATA_MOCK, pedidos } from "../types/mockApi";


// Obtener lista de clientes
export const obtenerClientes = async (): Promise<Cliente[]> => {
  return DATA_MOCK;
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number): Promise<Cliente | undefined> => {
  const lista = DATA_MOCK;
  return lista.find((cliente) => cliente.id === id);
};

// Obtener pedidos de cliente
export const obtenerPedidosPorCliente = async (clienteId: number) => { 
    return pedidos.filter((pedidos) => pedidos.clienteId === clienteId); 
};

// Crear cliente
export const crearCliente = async (nuevo: Cliente): Promise<Cliente> => {
  DATA_MOCK.push(nuevo);
  return nuevo;
};

// Editar cliente
export const actualizarCliente = async ( id: number, datos: Partial<Cliente>): Promise<Cliente | undefined> => {

  // Buscar el cliente por ID
  const cliente = DATA_MOCK.find((cliente) => cliente.id === id);

  if (!cliente) {
    return undefined;
  }

  // Obten su posición en array
  const index = DATA_MOCK.indexOf(cliente);

  // Crear nuevo objeto con los datos actualizados
  const clienteActualizado = {
    ...cliente,
    ...datos,
  };

  // Reemplazar el cliente por el nuevo
  DATA_MOCK[index] = clienteActualizado;

  // Devolver el cliente actualizado
  return clienteActualizado;
};


// Eliminar cliente
export const eliminarCliente = async (id: number): Promise<boolean> => {

  // Buscar el cliente por ID
  const index = DATA_MOCK.findIndex((cliente) => cliente.id === id);

  if (index === -1) {
    return false;
  }

  DATA_MOCK.splice(index, 1);
  return true;
};
