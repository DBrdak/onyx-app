import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";

interface State {
  budgetId: string;
  budgetMonth: number;
  budgetYear: number;
  categoryId: string | null;
  subcategoryId: string | null;
}

interface Actions {
  setBudgetMonth: (budgetMonth: number) => void;
  setBudgetYear: (budgetYear: number) => void;
  setCategoryId: (categoryId: string) => void;
  setBudgetId: (budgetId: string) => void;
  setSubcategoryId: (subcategoryId: string | null) => void;
  reset: () => void;
}

const DEFAULT_BUDGET_STATE: State = {
  budgetId: "",
  budgetMonth: DEFAULT_MONTH_NUMBER,
  budgetYear: DEFAULT_YEAR_NUMBER,
  categoryId: null,
  subcategoryId: null,
};

export const useBudgetStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_BUDGET_STATE,
      reset: () =>
        set(() => ({
          budgetId: "",
          budgetMonth: DEFAULT_MONTH_NUMBER,
          budgetYear: DEFAULT_YEAR_NUMBER,
          categoryId: null,
          subcategoryId: null,
        })),
      setBudgetMonth: (budgetMonth) => set({ budgetMonth }),
      setBudgetYear: (budgetYear) => set({ budgetYear }),
      setCategoryId: (categoryId) => set({ categoryId }),
      setBudgetId: (budgetId) => set({ budgetId }),
      setSubcategoryId: (subcategoryId) => set({ subcategoryId }),
    }),
    {
      name: "budgetStore",
    },
  ),
);

export const useBudgetId = () => useBudgetStore((state) => state.budgetId);
export const useBudgetMonth = () =>
  useBudgetStore((state) => state.budgetMonth);
export const useBudgetYear = () => useBudgetStore((state) => state.budgetYear);
export const useCategoryId = () => useBudgetStore((state) => state.categoryId);
export const useSubcategoryId = () =>
  useBudgetStore((state) => state.subcategoryId);

export const useBudgetActions = () => {
  const setBudgetMonth = useBudgetStore((state) => state.setBudgetMonth);
  const setBudgetYear = useBudgetStore((state) => state.setBudgetYear);
  const setCategoryId = useBudgetStore((state) => state.setCategoryId);
  const setBudgetId = useBudgetStore((state) => state.setBudgetId);
  const reset = useBudgetStore((state) => state.reset);
  const setSubcategoryId = useBudgetStore((state) => state.setSubcategoryId);

  return {
    setBudgetMonth,
    setBudgetYear,
    setCategoryId,
    setBudgetId,
    reset,
    setSubcategoryId,
  };
};

export const getBudgetId = () => useBudgetStore.getState().budgetId;
export const getBudgetMonth = () => useBudgetStore.getState().budgetMonth;
export const getBudgetYear = () => useBudgetStore.getState().budgetYear;
export const getCategoryId = () => useBudgetStore.getState().categoryId;
export const setBudgetId = useBudgetStore.getState().setBudgetId;
