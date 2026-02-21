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
  avatarUrl?: string;
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

/**
 * Comprueba si un email ya está registrado en la tabla de perfiles.
 * Útil para validaciones previas al registro o actualización.
 */
export const isEmailInUse = async (email: string, excludeId?: number): Promise<boolean> => {
  if (!email) return false;

  let query = supabase
    .from("users")
    .select("id")
    .eq("email", email.trim().toLowerCase());

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  // Si hay error de conexión devuelve false
  if (error) return false; 
  
  // true si encontró a alguien, false si no
  return !!data; 
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
export const register = async (email: string, password: string, nombre: string): Promise<AuthSession> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
    });

    if (authError) {
        if (authError.message.includes("already registered")) {
            throw new Error("Este correo electrónico ya está registrado.");
        }
        if (authError.message.includes("Password should be")) {
            throw new Error("La contraseña es demasiado débil.");
        }
        throw new Error(authError.message);
    }

    if (!authData.user) throw new Error("No se pudo crear la cuenta.");

    // ID de la tabla de autenticación
    const authUserId = authData.user.id;

    const { error: profileError } = await supabase.from("users").insert({
        // Aqui se sincroniza el usuario con el ID de la tabla de autenticación
        auth_user_id: authUserId,
        role_id: 1,
        name: nombre.trim(),
        email: email.trim(),
        avatar_url: null,
    });

    if (profileError) {
        console.error("Error al insertar perfil:", profileError);
        throw new Error("Error al crear el perfil de usuario en la base de datos.");
    }   

    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Si no hay sesión requiere confirmar email
    if (!authData.session) {
        throw new Error("Revisa tu correo para confirmar tu cuenta.");
    }

    // Obtener el perfil completo (incluyendo el rol) para el Store
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

    interface UserUpdateRow {
        name?: string;
        email?: string;
        avatar_url?: string;
        role_id?: number;
    }
    // Construimos el objeto de actualización dinámicamente
    const updateData: UserUpdateRow = {};
    if (payload.name) {
        updateData.name = payload.name.trim();
    }
    if (payload.avatarUrl) {
        updateData.avatar_url = payload.avatarUrl; 
    }

    const { data, error } = await supabase
        .from("users")
        .update( updateData )
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
        avatarUrl: data.avatar_url,
    };
};
