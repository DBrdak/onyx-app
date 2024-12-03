import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getStatisticsQueryOptions } from "@/lib/api/statistics";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import StatisticsCounterpartyCharts from "@/components/dashboard/statistics/statisticsCounterpartyCharts/StatisticsCounterpartyCharts";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/counterparties",
)({
  component: StatisticsCounterparty,
});

function StatisticsCounterparty() {
  const budgetId = useBudgetStore.use.budgetId();

  const { data: statistics } = useSuspenseQuery(
    getStatisticsQueryOptions(budgetId),
  );

  return <StatisticsCounterpartyCharts statistics={statistics} />;
}
