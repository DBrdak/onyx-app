import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";

interface State {
  selectedBudgetId: string;
  budgetMonth: number;
  budgetYear: number;
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;
}

interface Actions {
  setBudgetMonth: (budgetMonth: number) => void;
  setBudgetYear: (budgetYear: number) => void;
  setSelectedCategoryId: (selectedCategoryId: string) => void;
  setSelectedBudgetId: (selectedBudgetId: string) => void;
  setSelectedSubcategoryId: (selectedSubcategoryId: string | null) => void;
  reset: () => void;
}

const DEFAULT_BUDGET_STATE: State = {
  selectedBudgetId: "",
  budgetMonth: DEFAULT_MONTH_NUMBER,
  budgetYear: DEFAULT_YEAR_NUMBER,
  selectedCategoryId: null,
  selectedSubcategoryId: null,
};

export const useBudgetStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_BUDGET_STATE,
      reset: () =>
        set(() => ({
          selectedBudgetId: "",
          budgetMonth: DEFAULT_MONTH_NUMBER,
          budgetYear: DEFAULT_YEAR_NUMBER,
          selectedCategoryId: null,
        })),
      setBudgetMonth: (budgetMonth) => set({ budgetMonth }),
      setBudgetYear: (budgetYear) => set({ budgetYear }),
      setSelectedCategoryId: (selectedCategoryId) =>
        set({ selectedCategoryId }),
      setSelectedBudgetId: (selectedBudgetId) => set({ selectedBudgetId }),
      setSelectedSubcategoryId: (selectedSubcategoryId) =>
        set({ selectedSubcategoryId }),
    }),
    {
      name: "budgetStore",
    },
  ),
);

export const useSelectedBudgetId = () =>
  useBudgetStore((state) => state.selectedBudgetId);
export const useBudgetMonth = () =>
  useBudgetStore((state) => state.budgetMonth);
export const useBudgetYear = () => useBudgetStore((state) => state.budgetYear);
export const useSelectedCategoryId = () =>
  useBudgetStore((state) => state.selectedCategoryId);
export const useSelectedSubcategoryId = () =>
  useBudgetStore((state) => state.selectedSubcategoryId);

export const useBudgetActions = () => {
  const setBudgetMonth = useBudgetStore((state) => state.setBudgetMonth);
  const setBudgetYear = useBudgetStore((state) => state.setBudgetYear);
  const setSelectedCategoryId = useBudgetStore(
    (state) => state.setSelectedCategoryId,
  );
  const setSelectedBudgetId = useBudgetStore(
    (state) => state.setSelectedBudgetId,
  );
  const reset = useBudgetStore((state) => state.reset);
  const setSelectedSubcategoryId = useBudgetStore(
    (state) => state.setSelectedSubcategoryId,
  );

  return {
    setBudgetMonth,
    setBudgetYear,
    setSelectedCategoryId,
    setSelectedBudgetId,
    reset,
    setSelectedSubcategoryId,
  };
};

export const getSelectedBudgetId = () =>
  useBudgetStore.getState().selectedBudgetId;
export const getBudgetMonth = () => useBudgetStore.getState().budgetMonth;
export const getBudgetYear = () => useBudgetStore.getState().budgetYear;
export const getSelectedCategoryId = () =>
  useBudgetStore.getState().selectedCategoryId;
export const setSelectedBudgetId =
  useBudgetStore.getState().setSelectedBudgetId;
