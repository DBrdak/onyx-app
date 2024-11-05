import { create } from "@/store/initializeMemoryStore";
import { createSelectors } from "@/store/createSelectors";

import { type User } from "@/lib/validation/user";

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

const DEFAULT_AUTH_STATE = {
  accessToken: null,
  user: null,
  isInitialized: false,
};

const authStore = create<AuthState & AuthActions>()((set) => ({
  ...DEFAULT_AUTH_STATE,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  reset: () => set(DEFAULT_AUTH_STATE),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
}));

export const useAuthStore = createSelectors(authStore);

export const resetAuthStore = () => authStore.getState().reset();
