// Importar los datos mock (usuarios y roles).
import { usuarios, roles } from "../types/mockApi";
import type { User, Role } from "../types/mockApi";

// Tipo que representa la sesión completa tras iniciar sesión (user + role + token).
export type AuthSession = {
  user: User;
  role: Role;
  token: string;
};

// Tipo para actualizar el perfil del usuario.
export type UpdateUserPayload = {
  id: number;
  name: string;
  email: string;
};

// Recibe usuario y devuelve el usuario y su rol 
const mapProfile = (user: User) => {
  // Busca el rol que su id coincide con el roleId del usuario.
  const role = roles.find((rol) => rol.id === user.roleId);

  // Si no existe lanza error.
  if (!role) {
    throw new Error("Rol no encontrado para este usuario.");
  }

  // Devuelve el usuario y su rol.
  return { user, role };
};

// LOGIN
export const login = async (email: string, password: string): Promise<AuthSession> => {

  // Busca un usuario que email coincida
  const user = usuarios.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Si no existe o la contraseña no es "123456" da error.
  if (!user || password !== "123456") {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  // Obtiene el rol del usuario
  const { role } = mapProfile(user);

  // Genera un token falso 
  const token = `fake-token-${user.id}-${Date.now()}`;

  // Devuelve la sesion completa.
  return {
    user,
    role,
    token,
  };
};


// UPDATE
export const updateUserProfile = async (payload: UpdateUserPayload): Promise<User> => {

  // Busca usuario por id.
  const index = usuarios.findIndex((u) => u.id === payload.id);

  // Si no existe da error.
  if (index === -1) {
    throw new Error("Usuario no encontrado.");
  }

  // Actualiza datos del usuario.
  usuarios[index] = {
    ...usuarios[index],
    name: payload.name.trim(),
    email: payload.email.trim(),
  };

  // Devuelve el usuario actualizado.
  return usuarios[index];
};
