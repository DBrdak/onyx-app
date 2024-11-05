import { resetAccountStore } from "./accountStore";
import { resetBudgetStore } from "./budgetStore";
import { resetStatisticsStore } from "./statisticsStore";

const persistedDashboardStoreResetFns = new Set<() => void>([
  resetBudgetStore,
  resetAccountStore,
  resetStatisticsStore,
]);

export const resetAllDashboardStores = () => {
  persistedDashboardStoreResetFns.forEach((resetFn) => {
    resetFn();
  });
};
