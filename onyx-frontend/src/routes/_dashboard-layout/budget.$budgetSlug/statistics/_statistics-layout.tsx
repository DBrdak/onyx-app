import { createFileRoute } from "@tanstack/react-router";

import { findBudgetBySlug } from "..";
import {
  getBudgetId,
  setBudgetId,
  setBudgetSlug,
} from "@/store/dashboard/budgetStore";
import { resetAllDashboardStores } from "@/store/dashboard/resetPersistedDashboardStores";
import { getStatisticsQueryOptions } from "@/lib/api/statistics";
import { getAccountsQueryOptions } from "@/lib/api/account";
import StatisticsPendingComponent from "@/components/dashboard/statistics/StatisticsPendingComponent";

export const Route = createFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout",
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

    queryClient.ensureQueryData(getAccountsQueryOptions(budgetId));
    queryClient.ensureQueryData(getStatisticsQueryOptions(budgetId));
  },
  pendingComponent: () => <StatisticsPendingComponent />,
});
