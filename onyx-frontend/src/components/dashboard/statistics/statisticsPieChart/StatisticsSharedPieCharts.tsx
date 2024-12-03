import { FC, useMemo } from "react";
import { format } from "date-fns";

import {
  TStatisticsWithAssignedAmountSchema,
  TStatisticsWithEarnedAmountSchema,
} from "@/lib/validation/statistics";
import { Currency } from "@/lib/validation/base";
import { darkenColor } from "@/lib/utils";

import { type ChartConfig } from "@/components/ui/chart";

import InteractivePieChart from "./InteractivePieChart";

type DynamicPieKeys = "assignedAmount" | "earnedAmount";
type PieKeys = ["spentAmount", DynamicPieKeys];

type Total = {
  spentAmount: number;
  currency: Currency;
} & Record<DynamicPieKeys, number>;

type PieData = {
  sumSpentAmount: number;
  spentAmount: number;
  sumAssignedAmount?: number;
  assignedAmount?: number;
  sumEarnedAmount?: number;
  earnedAmount?: number;
  fill: string;
  label: string;
};

interface StatisticsSharedPieChartsProps {
  statistics: Record<
    string,
    TStatisticsWithAssignedAmountSchema[] | TStatisticsWithEarnedAmountSchema[]
  >;
  statisticsKeys: string[];
  pieKeys: PieKeys;
  fromDate: Date;
  toDate: Date;
  title?: string;
}

const StatisticsSharedPieCharts: FC<StatisticsSharedPieChartsProps> = ({
  statistics,
  statisticsKeys,
  pieKeys,
  fromDate,
  toDate,
  title,
}) => {
  const [sumPieKey, sharePieKey]: [
    "sumAssignedAmount" | "sumEarnedAmount",
    "assignedAmount" | "earnedAmount",
  ] =
    pieKeys[1] === "assignedAmount"
      ? ["sumAssignedAmount", "assignedAmount"]
      : ["sumEarnedAmount", "earnedAmount"];

  const { pieData, config, total } = useMemo(() => {
    const total: Total = {
      spentAmount: 0,
      assignedAmount: 0,
      earnedAmount: 0,
      currency: statistics[statisticsKeys[0]][0]?.spentAmount.currency,
    };

    const pieData: PieData[] = [];
    const config: ChartConfig = {};

    let color = "159 49% 52%";
    const minSelectedMonth = fromDate.getMonth() + 1;
    const maxSelectedMonth = toDate.getMonth() + 1;
    const selectedYear = fromDate.getFullYear();

    statisticsKeys.forEach((statKey) => {
      const current: PieData = {
        sumSpentAmount: 0,
        spentAmount: 0,
        [sharePieKey]: 0,
        [sumPieKey]: 0,
        fill: `hsl(${color})`,
        label: statKey,
      };

      for (const stat of statistics[statKey]) {
        const { month, spentAmount } = stat;

        if (
          month.year === selectedYear &&
          month.month >= minSelectedMonth &&
          month.month <= maxSelectedMonth
        ) {
          current.sumSpentAmount += spentAmount.amount;
          total.spentAmount += spentAmount.amount;

          const pieKeyAmount =
            pieKeys[1] === "assignedAmount" && "assignedAmount" in stat
              ? stat.assignedAmount.amount
              : pieKeys[1] === "earnedAmount" && "earnedAmount" in stat
                ? stat.earnedAmount.amount
                : 0;

          if (pieKeyAmount) {
            current[sumPieKey] = (current[sumPieKey] ?? 0) + pieKeyAmount;
            total[pieKeys[1]] += pieKeyAmount;
          }
        }
      }

      pieData.push(current);
      color = darkenColor(color, 15);
    });

    const totalSpent = total.spentAmount;
    const totalShare = total[pieKeys[1]];

    pieData.forEach((data) => {
      data.spentAmount = Math.round((data.sumSpentAmount * 100) / totalSpent);
      data[sharePieKey] = Math.round(
        ((data[sumPieKey] || 0) * 100) / totalShare,
      );

      config[data.label] = {
        color: data.fill,
        label: data.label,
      };
    });

    return { pieData, total, config };
  }, [
    fromDate,
    pieKeys,
    statistics,
    statisticsKeys,
    toDate,
    sharePieKey,
    sumPieKey,
  ]);

  const [formattedDateFrom, formattedDateTo] = useMemo(
    () => [format(fromDate, "MMMM"), format(toDate, "MMMM yyyy")],
    [fromDate, toDate],
  );

  return (
    <div className="md:flex md:space-x-4">
      {[sharePieKey, "spentAmount"].map((pieKey) => (
        <InteractivePieChart
          key={pieKey}
          config={config}
          data={pieData}
          dataKey={pieKey}
          total={`${total[pieKey as keyof Total]} ${total.currency}`}
          title={`${title ? title + " - " : ""}${pieKey.replace("Amount", "")} amount`}
          description={`${formattedDateFrom} - ${formattedDateTo}`}
        />
      ))}
    </div>
  );
};

export default StatisticsSharedPieCharts;
