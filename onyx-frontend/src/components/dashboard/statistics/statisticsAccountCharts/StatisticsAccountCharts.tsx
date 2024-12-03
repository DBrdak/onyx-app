import { FC, useMemo } from "react";

import DropdownStatisticsBarChart from "../statisticsBarChart/DropdownStatisticsBarChart";
import StatisticsSharedPieCharts from "../statisticsPieChart/StatisticsSharedPieCharts";
import { Card } from "@/components/ui/card";

import { type TStatisticsValueSchema } from "@/lib/validation/statistics";
import {
  useStatisticsDateRangeEnd,
  useStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";

interface StatisticsAccountChartsProps {
  statistics: TStatisticsValueSchema;
}

const StatisticsAccountCharts: FC<StatisticsAccountChartsProps> = ({
  statistics,
}) => {
  const accounts = statistics.accounts.data;
  const statisticsDateStart = useStatisticsDateRangeStart();
  const statisticsDateRangeEnd = useStatisticsDateRangeEnd();
  const currency = accounts["all"][0].spentAmount.currency;
  const accountsKeys = useMemo(
    () => Object.keys(accounts).filter((k) => k !== "all"),
    [accounts],
  );

  return (
    <div className="space-y-14">
      <Card className="px-2 py-4">
        <DropdownStatisticsBarChart
          statistics={accounts}
          barKeys={["earnedAmount", "spentAmount"]}
          fromDate={statisticsDateStart}
          toDate={statisticsDateRangeEnd}
          header="Account:"
          unit={currency}
        />
      </Card>

      <StatisticsSharedPieCharts
        statistics={accounts}
        fromDate={statisticsDateStart}
        toDate={statisticsDateRangeEnd}
        pieKeys={["spentAmount", "earnedAmount"]}
        statisticsKeys={accountsKeys}
        title="Accounts"
      />
    </div>
  );
};

export default StatisticsAccountCharts;
