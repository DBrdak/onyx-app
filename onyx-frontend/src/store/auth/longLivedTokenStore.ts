import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useLongLivedToken = () =>
  useLongLivedTokenStore((state) => state.longLivedToken);
export const useSetLongLivedToken = () =>
  useLongLivedTokenStore((state) => state.setLongLivedToken);
export const useRemoveLongLivedToken = () =>
  useLongLivedTokenStore((state) => state.removeLongLivedToken);
