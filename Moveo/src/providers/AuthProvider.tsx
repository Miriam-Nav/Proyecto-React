import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useUserStore } from "../stores/user.store";
import { supabase } from "../config/supabaseClient";
import { fetchProfileByAuthId } from "../services/authService";

// Evita que la pantalla de carga se quite antes de tiempo
SplashScreen.preventAutoHideAsync();

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    logOut: async () => { },
});

export function AuthProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const segments = useSegments();
    
    // Obtiene datos y acciones de Store de Zustand
    const { user, token, setUser, clearUser } = useUserStore();
    
    // Estado para controlar la carga
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    // Está logueado si tiene usuario y token
    const isLoggedIn = useMemo(() => Boolean(user && token), [user, token]);

    useEffect(() => {
        let isMounted = true;

        // Sincronizar el perfil de Supabase con la App
        const syncProfile = async (session: any) => {
            if (!session?.user?.id) {
                clearUser();
                return;
            }

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
                    await supabase.auth.signOut();
                }
            }
        };

        // Carga inicial de la sesión al abrir la App
        const initializeAuth = async () => {
            const { data } = await supabase.auth.getSession();
            
            if (data?.session) {
                await syncProfile(data.session);
            } else {
                clearUser();
            }

            if (isMounted) setIsAuthReady(true);
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_OUT" || !session) {
                    clearUser();
                } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
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
            SplashScreen.hideAsync();
        }
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
    };

    return (
        <AuthContext.Provider value={{ isReady: isAuthReady, isLoggedIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}