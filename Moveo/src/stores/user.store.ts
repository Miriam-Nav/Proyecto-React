import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  setUser: (user: User, role: Role, token: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,

      setUser: (user, role, token) =>
        set({
          user,
          role,
          token,
        }),

      clearUser: () =>
        set({
          user: null,
          role: null,
          token: null,
        }),
    }),
    {
      name: "user-storage", 
    }
  )
);

