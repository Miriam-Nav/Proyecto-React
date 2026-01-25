import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { Platform } from "react-native";
import { createSelectors } from "./createSelectors"; // El archivo auxiliar que creamos

// Tipos requeridos por la actividad
type User = {
    id: number;
    name: string;
    email: string;
    roleId: number;
};

type Role = {
    id: number;
    name: string;
};

type UserState = {
    user: User | null;
    role: Role | null;
    token: string | null;

    // Acción para inicializar tras el login (como pide la tarea)
    setUser: (user: User | null, role: Role | null, token?: string | null) => void;
    // Acción para limpiar al cerrar sesión
    clearUser: () => void;
};

// --- CONFIGURACIÓN DE STORAGE (ESTILO PROFE / ANTI-ERROR WEB) ---

const webStorage: StateStorage = {
    getItem: (name) => (typeof window !== "undefined" ? localStorage.getItem(name) : null),
    setItem: (name, value) => { if (typeof window !== "undefined") localStorage.setItem(name, value); },
    removeItem: (name) => { if (typeof window !== "undefined") localStorage.removeItem(name); },
};

// Usamos require para que la Web no intente importar AsyncStorage
const storage = createJSONStorage(() => 
    Platform.OS === "web" 
        ? webStorage 
        : require("@react-native-async-storage/async-storage").default
);

// --- CREACIÓN DEL STORE ---

const useUserStoreBase = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            role: null,
            token: null,

            setUser: (user, role, token) =>
                set((state) => ({
                    user,
                    role,
                    token: token !== undefined ? token : state.token,
                })),

            clearUser: () => set({ user: null, role: null, token: null }),
        }),
        {
            name: "user-data-storage", // Nombre de la persistencia
            storage,
            // Opcional: solo persistir estos campos
            partialize: (state) => ({
                user: state.user,
                role: state.role,
                token: state.token,
            }),
        }
    )
);

// Aplicamos los selectores mágicos para poder hacer: useUserStore.use.user()
export const useUserStore = createSelectors(useUserStoreBase);