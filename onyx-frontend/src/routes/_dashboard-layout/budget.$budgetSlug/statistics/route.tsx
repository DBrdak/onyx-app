import { createFileRoute } from "@tanstack/react-router";

import { findBudgetBySlug } from "..";
import { getCategoryStatsQueryOptions } from "@/lib/api/statistics";
import {
  getBudgetId,
  setBudgetId,
  setBudgetSlug,
} from "@/store/dashboard/budgetStore";
import {
  getStatisticsDateRangeEnd,
  getStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";
import { resetAllDashboardStores } from "@/store/dashboard/resetPersistedDashboardStores";

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
    const dateRangeStart = getStatisticsDateRangeStart();
    const dateRangeEnd = getStatisticsDateRangeEnd();

    queryClient.ensureQueryData(
      getCategoryStatsQueryOptions(budgetId, { dateRangeEnd, dateRangeStart }),
    );
  },
});
