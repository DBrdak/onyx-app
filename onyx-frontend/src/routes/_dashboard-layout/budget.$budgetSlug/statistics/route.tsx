import { createFileRoute } from "@tanstack/react-router";

import { findBudgetBySlug } from "..";
import {
  getBudgetId,
  setBudgetId,
  setBudgetSlug,
} from "@/store/dashboard/budgetStore";
import { resetAllDashboardStores } from "@/store/dashboard/resetPersistedDashboardStores";
import { getStatisticsQueryOptions } from "@/lib/api/statistics";

export const Route = createFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics",
)({
  beforeLoad: async ({ context: { queryClient }, params: { budgetSlug } }) => {
    const budget = await findBudgetBySlug(queryClient, budgetSlug);
    const currentBudgetId = getBudgetId();

    if (budget.id === currentBudgetId) return;

    resetAllDashboardStores();
    setBudgetId(budget.id);
    setBudgetSlug(budget.slug);
  },
  loader: ({ context: { queryClient } }) => {
    const budgetId = getBudgetId();

    queryClient.ensureQueryData(getStatisticsQueryOptions(budgetId));
  },
});
