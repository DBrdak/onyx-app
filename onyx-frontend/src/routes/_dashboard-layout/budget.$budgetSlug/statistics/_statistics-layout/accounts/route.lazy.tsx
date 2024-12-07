import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import StatisticsAccountCharts from "@/components/dashboard/statistics/statisticsAccountCharts/StatisticsAccountCharts";

import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { getStatisticsQueryOptions } from "@/lib/api/statistics";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/accounts",
)({
  component: StatisticsAccounts,
});

function StatisticsAccounts() {
  const budgetId = useBudgetStore.use.budgetId();

  const { data: statistics } = useSuspenseQuery(
    getStatisticsQueryOptions(budgetId),
  );

  return <StatisticsAccountCharts statistics={statistics} />;
}
