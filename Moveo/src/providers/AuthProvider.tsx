import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useUserStore } from "../stores/user.store";
import { supabase } from "../config/supabaseClient";
import { fetchProfileByAuthId } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Evita que la pantalla de carga se quite antes de tiempo
SplashScreen.preventAutoHideAsync();

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    authUserId: string | null;
    logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    authUserId: null,
    logOut: async () => { },
});

export function AuthProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const segments = useSegments();
    
    // Obtiene datos y acciones de Store de Zustand
    const { user, token, setUser, clearUser } = useUserStore();
    
    // Estado para controlar la carga
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    // Estado para el ID de auth de Supabase (UUID)
    const [authUserId, setAuthUserId] = useState<string | null>(null);
    
    // Está logueado si tiene usuario y token
    const isLoggedIn = useMemo(() => Boolean(user && token), [user, token]);

    useEffect(() => {
        let isMounted = true;

        // Sincronizar el perfil de Supabase con la App
        const syncProfile = async (session: any) => {
            if (!session?.user?.id) {
                clearUser();
                setAuthUserId(null);
                return;
            }

            // Actualizar el authUserId (UUID de Supabase)
            setAuthUserId(session.user.id);

            try {
                // Busca datos en tabla 'users' 
                const profile = await fetchProfileByAuthId(session.user.id);
                if (isMounted) {
                    setUser(profile.user, profile.role, session.access_token);
                }
            } catch (error) {
                console.error("Error sincronizando perfil:", error);
                if (isMounted) {
                    clearUser();
                    setAuthUserId(null);
                    await supabase.auth.signOut();
                }
            }
        };

        // Carga inicial de la sesión al abrir la App
        const initializeAuth = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                
                // Si hay error de token inválido, limpiar completamente el almacenamiento
                if (error) {
                    // Detectar error específico de refresh token
                    const isRefreshTokenError = error.message?.includes('Refresh Token');
                    
                    if (isRefreshTokenError) {
                        console.log("🧹 Limpiando sesión corrupta...");
                        // Limpiar AsyncStorage de Supabase
                        try {
                            const keys = await AsyncStorage.getAllKeys();
                            const supabaseKeys = keys.filter(key => 
                                key.includes('supabase') || key.includes('auth')
                            );
                            if (supabaseKeys.length > 0) {
                                await AsyncStorage.multiRemove(supabaseKeys);
                            }
                        } catch (storageError) {
                            console.warn("Error limpiando storage:", storageError);
                        }
                    } else {
                        console.warn("Error obteniendo sesión:", error.message);
                    }
                    
                    try {
                        await supabase.auth.signOut();
                    } catch (signOutError) {
                        // Ignorar error al cerrar sesión inexistente
                    }
                    clearUser();
                    setAuthUserId(null);
                } else if (data?.session) {
                    await syncProfile(data.session);
                } else {
                    clearUser();
                    setAuthUserId(null);
                }
            } catch (error: any) {
                // Solo mostrar error si NO es el error común de refresh token
                if (!error?.message?.includes('Refresh Token')) {
                    console.error("Error inicializando auth:", error);
                }
                
                // Limpiar sesión corrupta silenciosamente
                try {
                    await supabase.auth.signOut();
                } catch {
                    // Ignorar
                }
                clearUser();
                setAuthUserId(null);
            } finally {
                // Asegura que siempre se marca como listo
                if (isMounted) {
                    setIsAuthReady(true);
                }
            }
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Manejar tokens inválidos o sesión corrupta
                if (event === "SIGNED_OUT" || !session) {
                    clearUser();
                    setAuthUserId(null);
                } else if (event === "TOKEN_REFRESHED" && session) {
                    await syncProfile(session);
                } else if (event === "SIGNED_IN" && session) {
                    await syncProfile(session);
                } else if (event === "USER_UPDATED" && session) {
                    await syncProfile(session);
                }
            }
        );

        return () => {
            isMounted = false;
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    // Ocultar SplashScreen cuando todo esté listo
    useEffect(() => {
        if (isAuthReady) {
            SplashScreen.hideAsync().catch((error) => {
                console.warn("Error ocultando splash:", error);
            });
        }
    }, [isAuthReady]);

    // Timeout de seguridad: ocultar splash después de 5s máximo
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isAuthReady) {
                console.warn("Timeout: forzando ocultar splash screen");
                setIsAuthReady(true);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [isAuthReady]);

    // Lógica de Redirección 
    useEffect(() => {
        if (!isAuthReady) return;

        const inProtectedGroup = segments[0] === "(protected)";

        if (!isLoggedIn && inProtectedGroup) {
            // Si no hay sesión va al Login
            router.replace("/");
        } else if (isLoggedIn && !inProtectedGroup) {
            // Si ya hay sesión entra a la App
            router.replace("/home");
        }
    }, [isLoggedIn, isAuthReady, segments]);

    const logOut = async () => {
        await supabase.auth.signOut();
        clearUser();
        setAuthUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isReady: isAuthReady, isLoggedIn, authUserId, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}