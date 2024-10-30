import { createFileRoute } from "@tanstack/react-router";

import { findBudgetBySlug } from "..";
import { initializeBudgetStore } from "@/store/dashboard/boundDashboardStore";
import { getCategoryStatsQueryOptions } from "@/lib/api/statistics";
import { getBudgetId } from "@/store/dashboard/budgetStore";
import {
  getStatisticsDateRangeEnd,
  getStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";

export const Route = createFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics",
)({
  beforeLoad: async ({ context: { queryClient }, params: { budgetSlug } }) => {
    const budget = await findBudgetBySlug(queryClient, budgetSlug);
    initializeBudgetStore(budget.id, budgetSlug);
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
