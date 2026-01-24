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

// Recibe usuario y devuelve:
// - el usuario
// - su rol correspondiente (buscado en roles[])
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

// -------------------------------------------------------------
// login
// -------------------------------------------------------------
// Simula un login realista, igual que el del profesor pero sin Supabase.
export const login = async (email: string, password: string): Promise<AuthSession> => {
  // Simulamos un retardo de red (400 ms).
  await new Promise((r) => setTimeout(r, 400));

  // Buscamos un usuario cuyo email coincida (ignorando mayúsculas/minúsculas).
  const user = usuarios.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Si no existe o la contraseña no es "123456", error.
  if (!user || password !== "123456") {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  // Obtenemos el rol del usuario usando mapProfile.
  const { role } = mapProfile(user);

  // Generamos un token falso (como haría Supabase).
  const token = `fake-token-${user.id}-${Date.now()}`;

  // Devolvemos la sesión completa.
  return {
    user,
    role,
    token,
  };
};

// -------------------------------------------------------------
// register
// -------------------------------------------------------------
// Simula un registro de usuario, igual que el del profesor.
export const register = async (email: string, password: string): Promise<AuthSession> => {
  // Simulamos retardo de red.
  await new Promise((r) => setTimeout(r, 400));

  // Si ya existe un usuario con ese email, error.
  if (usuarios.some((u) => u.email === email)) {
    throw new Error("El usuario ya existe.");
  }

  // Creamos un nuevo usuario con rol NORMAL (roleId = 1).
  const newUser: User = {
    id: usuarios.length + 1,
    roleId: 1,
    name: email.split("@")[0], // nombre base sacado del email
    email,
  };

  // Lo añadimos al array de usuarios mock.
  usuarios.push(newUser);

  // Obtenemos su rol.
  const { role } = mapProfile(newUser);

  // Generamos token falso.
  const token = `fake-token-${newUser.id}-${Date.now()}`;

  // Devolvemos la sesión completa.
  return {
    user: newUser,
    role,
    token,
  };
};

// -------------------------------------------------------------
// updateUserProfile
// -------------------------------------------------------------
// Simula la actualización del perfil del usuario.
// Es equivalente al updateUserProfile del profesor.
export const updateUserProfile = async (payload: UpdateUserPayload): Promise<User> => {
  // Simulamos retardo de red.
  await new Promise((r) => setTimeout(r, 300));

  // Buscamos el usuario por id.
  const index = usuarios.findIndex((u) => u.id === payload.id);

  // Si no existe, error.
  if (index === -1) {
    throw new Error("Usuario no encontrado.");
  }

  // Actualizamos los datos del usuario.
  usuarios[index] = {
    ...usuarios[index],
    name: payload.name.trim(),
    email: payload.email.trim(),
  };

  // Devolvemos el usuario actualizado.
  return usuarios[index];
};
