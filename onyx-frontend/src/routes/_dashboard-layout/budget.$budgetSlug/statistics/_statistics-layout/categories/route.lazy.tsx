import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { getStatisticsQueryOptions } from "@/lib/api/statistics";
import StatisticsCategoryCharts from "@/components/dashboard/statistics/statisticsCategoryCharts/StatisticsCategoryCharts";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/categories",
)({
  component: StatisticsCategories,
});

function StatisticsCategories() {
  const budgetId = useBudgetStore.use.budgetId();

  const { data: statistics } = useSuspenseQuery(
    getStatisticsQueryOptions(budgetId),
  );

  return <StatisticsCategoryCharts statistics={statistics} />;
}
