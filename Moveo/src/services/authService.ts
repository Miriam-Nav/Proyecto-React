import { Role, User } from "../types/User";
import { supabase } from "../config/supabaseClient";


// Sesión completa 
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

// Tipo para lo que viene de la base de datos
type UserProfileRow = {
    id: number;
    role_id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    roles: {
      id: number;
      name: string;
      description: string | null;
  };
};

// Recibe usuario y devuelve el usuario y su rol 
const mapProfile = (data: UserProfileRow) => {
  const roleData = Array.isArray(data.roles) ? data.roles[0] : data.roles;

  // Busca el rol que su id coincide con el roleId del usuario.
  const role: Role = {
    id: roleData.id,
    name: roleData.name,
    description: roleData.description ?? undefined,
  };

  return {
    user: {
      id: data.id,
      roleId: data.role_id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url ?? undefined,
    },
    role,
  };
};

// Busca perfil en 'users' usando el ID de Auth
export const fetchProfileByAuthId = async (authUserId: string) => {
    console.log("Buscando perfil para UUID:", authUserId);
    const { data, error } = await supabase
        .from("users")
        .select("id, role_id, name, email, avatar_url, roles ( id, name, description )")
        .eq("auth_user_id", authUserId)
        .single();

    if (error || !data) {
        throw new Error("No se encontró el perfil del usuario.");
    }

    return mapProfile(data as unknown as UserProfileRow);
};


// LOGIN
export const logIn = async (email: string, password: string): Promise<AuthSession> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
    });

    if (authError || !authData.session || !authData.user) {
        throw new Error("Usuario o contraseña incorrectos.");
    }
    const { user, role } = await fetchProfileByAuthId(authData.user.id);

    return {
        user,
        role,
        token: authData.session.access_token,
    };
};

// REGISTRO
export const register = async (email: string, password: string): Promise<AuthSession> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
    });

    if (authError || !authData.user) {
        throw new Error("No se pudo crear la cuenta.");
    }

    const authUserId = authData.user.id;
    const baseName = email.split("@")[0]?.trim() || "Nuevo usuario";

    const { error: profileError } = await supabase.from("users").insert({
        auth_user_id: authUserId,
        role_id: 1,
        name: baseName,
        email: email.trim(),
        avatar_url: null,
    });

    if (profileError) {
        throw new Error("Error al crear el perfil de usuario.");
    }

    // Si no hay sesión requiere confirmar email
    if (!authData.session) {
        throw new Error("Revisa tu correo para confirmar tu cuenta.");
    }

    const { user, role } = await fetchProfileByAuthId(authUserId);

    return {
        user,
        role,
        token: authData.session.access_token,
    };
}


// UPDATE
export const updateUserProfile = async (payload: UpdateUserPayload): Promise<User> => {
    // Verifica que el ID existe
    if (!payload.id) throw new Error("ID de usuario no proporcionado");

    const { data, error } = await supabase
        .from("users")
        .update({
            name: payload.name.trim(),
        })
        .eq("id", payload.id)
        .select()
        .single();

    if (error || !data) {
        console.error("Error en DB:", error);
        throw new Error("No se pudo actualizar el perfil.");
    }

    // Retorna el objeto mapeado correctamente
    return {
        id: data.id,
        roleId: data.role_id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url ?? undefined,
    };
};
