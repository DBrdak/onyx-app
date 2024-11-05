import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@/store/createSelectors";

interface LongLivedTokenState {
  longLivedToken: string | null;
}

interface LongLivedTokenActions {
  setLongLivedToken: (newToken: string) => void;
  removeLongLivedToken: () => void;
}

export const longLivedTokenStore = create<
  LongLivedTokenState & LongLivedTokenActions
>()(
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
);

export const useLongLivedTokenStore = createSelectors(longLivedTokenStore);

export const resetLongLivedToken = () =>
  longLivedTokenStore.getState().removeLongLivedToken();
