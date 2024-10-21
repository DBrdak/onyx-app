import { create } from "zustand";
import { useBudgetStore } from "./budgetStore";
import { useAccountStore } from "./accountStore";

interface Actions {
  resetAllStores: () => void;
  initializeBudgetStore: (budgetId: string) => void;
}

export const useDashboardStore = create<Actions>((set, get) => ({
  resetAllStores: () => {
    useBudgetStore.getState().reset();
    useAccountStore.getState().reset();
  },
  initializeBudgetStore: (budgetId) => {
    const currentlySelectedBudgetId = useBudgetStore.getState().budgetId;

    if (currentlySelectedBudgetId === budgetId) return;

    get().resetAllStores();

    const setNewBudgetId = useBudgetStore.getState().setBudgetId;
    setNewBudgetId(budgetId);
  },
}));

export const resetAllStores = useDashboardStore.getState().resetAllStores;
export const initializeBudgetStore =
  useDashboardStore.getState().initializeBudgetStore;
