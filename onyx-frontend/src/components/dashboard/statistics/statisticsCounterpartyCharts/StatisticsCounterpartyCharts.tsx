import { FC, useMemo } from "react";

import { Card } from "@/components/ui/card";
import DropdownStatisticsBarChart from "../statisticsBarChart/DropdownStatisticsBarChart";
import StatisticsSharedPieCharts from "../statisticsPieChart/StatisticsSharedPieCharts";

import {
  useStatisticsDateRangeEnd,
  useStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";
import { type TStatisticsValueSchema } from "@/lib/validation/statistics";

interface StatisticsCounterpartyChartsProps {
  statistics: TStatisticsValueSchema;
}

const StatisticsCounterpartyCharts: FC<StatisticsCounterpartyChartsProps> = ({
  statistics,
}) => {
  const counterparties = statistics.counterparties.data;
  const statisticsDateStart = useStatisticsDateRangeStart();
  const statisticsDateRangeEnd = useStatisticsDateRangeEnd();
  const currency = counterparties["all"][0].spentAmount.currency;
  const counterpartiesKeys = useMemo(
    () => Object.keys(counterparties).filter((k) => k !== "all"),
    [counterparties],
  );

  return (
    <div className="space-y-14">
      <Card className="px-2 py-4">
        <DropdownStatisticsBarChart
          statistics={counterparties}
          barKeys={["earnedAmount", "spentAmount"]}
          fromDate={statisticsDateStart}
          toDate={statisticsDateRangeEnd}
          header="Counterparty:"
          unit={currency}
        />
      </Card>

      <StatisticsSharedPieCharts
        statistics={counterparties}
        fromDate={statisticsDateStart}
        toDate={statisticsDateRangeEnd}
        pieKeys={["spentAmount", "earnedAmount"]}
        statisticsKeys={counterpartiesKeys}
        title="Counterparties"
      />
    </div>
  );
};

export default StatisticsCounterpartyCharts;
