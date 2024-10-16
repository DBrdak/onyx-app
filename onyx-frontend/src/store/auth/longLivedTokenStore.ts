import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LongLivedTokenState {
  longLivedToken: string | null;
}

interface LongLivedTokenActions {
  setLongLivedToken: (newToken: string) => void;
  removeLongLivedToken: () => void;
}

export const useLongLivedTokenStore = create<
  LongLivedTokenState & LongLivedTokenActions
>()(
  devtools(
    persist(
      (set) => ({
        longLivedToken: null,
        setLongLivedToken: (newToken) =>
          set(() => ({ longLivedToken: newToken })),
        removeLongLivedToken: () => set(() => ({ longLivedToken: null })),
      }),
      {
        name: "longLivedToken",
      },
    ),
  ),
);
