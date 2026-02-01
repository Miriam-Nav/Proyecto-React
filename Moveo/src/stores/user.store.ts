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
    getItem: async (name) =>
        typeof window === "undefined" ? null : window.localStorage.getItem(name),
    setItem: async (name, value) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(name, value);
    },
    removeItem: async (name) => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(name);
    },
};

const nativeSecureStorage: StateStorage = {
    getItem: async (name) => {
        const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
        const value = await SecureStore.getItemAsync(name);
        return value ?? null;
    },
    setItem: async (name, value) => {
        const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name) => {
        const SecureStore = require("expo-secure-store") as typeof import("expo-secure-store");
        await SecureStore.deleteItemAsync(name);
    },
};

const storage = createJSONStorage(() => {
    if (Platform.OS === "web") {
        return typeof window !== "undefined" ? webStorage : noopStorage;
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