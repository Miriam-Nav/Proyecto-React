import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { createSelectors } from "./createSelectors";
import { Role, User } from "../types/User";

type UserState = {
    user: User | null;
    role: Role | null;
    token: string | null;

    setUser: (user: User | null, role: Role | null, token?: string | null) => void;
    clearUser: () => void;
};

const noopStorage: StateStorage = {
    getItem: async () => null,
    setItem: async () => { },
    removeItem: async () => { },
};

const webStorage: StateStorage = {
    getItem: async (name) => {
        try {
            if (Platform.OS === 'web' && globalThis.localStorage) {
                return globalThis.localStorage.getItem(name);
            }
            return null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    },
    setItem: async (name, value) => {
        try {
            if (Platform.OS === 'web' && globalThis.localStorage) {
                globalThis.localStorage.setItem(name, value);
            }
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    },
    removeItem: async (name) => {
        try {
            if (Platform.OS === 'web' && globalThis.localStorage) {
                globalThis.localStorage.removeItem(name);
            }
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
        }
    },
};

const nativeSecureStorage: StateStorage = {
    getItem: async (name) => {
        try {
            const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
            const value = await SecureStore.getItemAsync(name);
            return value ?? null;
        } catch (error) {
            console.error('Error al leer de SecureStore:', error);
            return null;
        }
    },
    setItem: async (name, value) => {
        try {
            const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
            await SecureStore.setItemAsync(name, value);
        } catch (error) {
            console.error('Error al guardar en SecureStore:', error);
        }
    },
    removeItem: async (name) => {
        try {
            const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
            await SecureStore.deleteItemAsync(name);
        } catch (error) {
            console.error('Error al eliminar de SecureStore:', error);
        }
    },
};

const storage = createJSONStorage(() => {
    if (Platform.OS === "web") {
        return webStorage;
    }
    return nativeSecureStorage;
});


export const useUserStore = createSelectors(
    create<UserState>()(
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
                name: "user-data-storage",
                storage,
                partialize: (state) => ({
                    user: state.user,
                    role: state.role,
                    token: state.token,
                }),
            }
        )
    )
);  