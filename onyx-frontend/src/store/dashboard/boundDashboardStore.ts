import { create } from "zustand";
import { useBudgetStore } from "./budgetStore";

interface State {
  resetAllStores: () => void;
}

export const useDashboardStore = create<State>(() => ({
  resetAllStores: () => {
    useBudgetStore.getState().reset();
  },
}));

export const resetAllStores = useDashboardStore.getState().resetAllStores;
