import { create } from "zustand";

import { User } from "@/lib/validation/user";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isInitialized: boolean;
};

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  reset: () => void;
  setIsInitialized: (initialized: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  reset: () => set({ user: null, accessToken: null, isInitialized: true }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
}));

export const useUser = () => useAuthStore((state) => state.user);
