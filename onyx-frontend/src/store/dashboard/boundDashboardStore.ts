import { create } from "zustand";
import { useBudgetStore } from "./budgetStore";
import { useAccountStore } from "./accountStore";
import { useStatisticsStore } from "./statisticsStore";

interface Actions {
  resetAllStores: () => void;
  initializeBudgetStore: (budgetId: string, budgetSlug: string) => void;
}

export const useDashboardStore = create<Actions>((set, get) => ({
  resetAllStores: () => {
    useBudgetStore.getState().reset();
    useAccountStore.getState().reset();
    useStatisticsStore.getState().reset();
  },
  initializeBudgetStore: (budgetId, budgetSlug) => {
    const currentlySelectedBudgetId = useBudgetStore.getState().budgetId;

    if (currentlySelectedBudgetId === budgetId) return;

    get().resetAllStores();

    const setNewBudgetId = useBudgetStore.getState().setBudgetId;
    const setNewBudgetSlug = useBudgetStore.getState().setBudgetSlug;
    setNewBudgetId(budgetId);
    setNewBudgetSlug(budgetSlug);
  },
}));

export const resetAllStores = useDashboardStore.getState().resetAllStores;
export const initializeBudgetStore =
  useDashboardStore.getState().initializeBudgetStore;
