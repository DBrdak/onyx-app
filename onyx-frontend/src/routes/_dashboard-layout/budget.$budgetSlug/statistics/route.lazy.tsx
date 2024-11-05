import { useEffect, useRef } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import StatisticsDateNavbar from "@/components/dashboard/statistics/statisticsDateNavbar/StatisticsDateNavbar";
import StatisticsCategoryBarChart from "@/components/dashboard/statistics/StatisticsCategoryBarChart";

import { getCategoryStatsQueryOptions } from "@/lib/api/statistics";
import {
  useStatisticsDateRangeEnd,
  useStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics",
)({
  component: Statistics,
});

function Statistics() {
  const queryClient = useQueryClient();
  const budgetId = useBudgetStore.use.budgetId();
  const dateRangeStart = useStatisticsDateRangeStart();
  const dateRangeEnd = useStatisticsDateRangeEnd();

  const { data: categoryStatistics } = useSuspenseQuery(
    getCategoryStatsQueryOptions(budgetId, { dateRangeEnd, dateRangeStart }),
  );

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (dateRangeStart && dateRangeEnd) {
      queryClient.invalidateQueries(
        getCategoryStatsQueryOptions(budgetId, {
          dateRangeEnd,
          dateRangeStart,
        }),
      );
    }
  }, [dateRangeStart, dateRangeEnd]);

  return (
    <div>
      <StatisticsDateNavbar />
      <div>
        <StatisticsCategoryBarChart
          categoryStatistics={categoryStatistics}
          dateRangeEnd={dateRangeEnd}
          dateRangeStart={dateRangeStart}
        />
      </div>
    </div>
  );
}
