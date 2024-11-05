import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";
import { createSelectors } from "@/store/createSelectors";

interface State {
  budgetId: string;
  budgetSlug: string;
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
  setBudgetSlug: (budgetSlug: string) => void;
  reset: () => void;
}

const DEFAULT_BUDGET_STATE: State = {
  budgetId: "",
  budgetSlug: "",
  budgetMonth: DEFAULT_MONTH_NUMBER,
  budgetYear: DEFAULT_YEAR_NUMBER,
  categoryId: null,
  subcategoryId: null,
};

const budgetStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_BUDGET_STATE,
      reset: () => set(() => DEFAULT_BUDGET_STATE),
      setBudgetMonth: (budgetMonth) => set({ budgetMonth }),
      setBudgetYear: (budgetYear) => set({ budgetYear }),
      setCategoryId: (categoryId) => set({ categoryId }),
      setBudgetId: (budgetId) => set({ budgetId }),
      setSubcategoryId: (subcategoryId) => set({ subcategoryId }),
      setBudgetSlug: (budgetSlug) => set({ budgetSlug }),
    }),
    {
      name: "budgetStore",
    },
  ),
);

export const useBudgetStore = createSelectors(budgetStore);

export const getBudgetId = () => budgetStore.getState().budgetId;
export const getBudgetMonth = () => budgetStore.getState().budgetMonth;
export const getBudgetYear = () => budgetStore.getState().budgetYear;
export const getCategoryId = () => budgetStore.getState().categoryId;
export const setBudgetId = budgetStore.getState().setBudgetId;
export const setBudgetSlug = budgetStore.getState().setBudgetSlug;

export const resetBudgetStore = () => budgetStore.getState().reset();
