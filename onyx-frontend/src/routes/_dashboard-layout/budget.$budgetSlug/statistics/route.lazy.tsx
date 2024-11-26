import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import StatisticsDateNavbar from "@/components/dashboard/statistics/statisticsDateNavbar/StatisticsDateNavbar";

import { getStatisticsQueryOptions } from "@/lib/api/statistics";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import StatisticsCategoryCharts from "@/components/dashboard/statistics/statisticsCategoryCharts/StatisticsCategoryCharts";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics",
)({
  component: Statistics,
});

function Statistics() {
  const budgetId = useBudgetStore.use.budgetId();

  const { data: statistics } = useSuspenseQuery(
    getStatisticsQueryOptions(budgetId),
  );

  return (
    <div className="flex h-full flex-col space-y-8 lg:overflow-hidden">
      <StatisticsDateNavbar />
      <ScrollArea className="mb-2 h-full pb-8 lg:px-4">
        <StatisticsCategoryCharts statistics={statistics} />
      </ScrollArea>
    </div>
  );
}
