import { resetAuthStore } from "./auth/authStore";
import { resetLongLivedToken } from "./auth/longLivedTokenStore";
import { resetAccountStore } from "./dashboard/accountStore";
import { resetBudgetStore } from "./dashboard/budgetStore";
import { resetStatisticsStore } from "./dashboard/statisticsStore";

const allPersistedStoreResetFns = new Set<() => void>([
  resetAuthStore,
  resetLongLivedToken,
  resetBudgetStore,
  resetAccountStore,
  resetStatisticsStore,
]);

export const resetAllPersistedStores = () => {
  allPersistedStoreResetFns.forEach((resetFn) => resetFn());
};
