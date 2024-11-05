import { FC, useState } from "react";
import { MONTHS } from "@/lib/constants/date";
import { CategoryStat } from "@/lib/validation/statistics";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LineChart, XAxis } from "recharts";

interface statisticsCategoryBarChartProps {
  categoryStatistics: CategoryStat[];
  dateRangeStart: Date;
  dateRangeEnd: Date;
}

const StatisticsCategoryBarChart: FC<statisticsCategoryBarChartProps> = ({
  categoryStatistics,
  dateRangeEnd,
  dateRangeStart,
}) => {
  const barChartData = Object.fromEntries(
    [
      "All",
      ...Object.values(categoryStatistics.map((c) => c.categoryName)),
    ].map((v) => [
      v,
      MONTHS.slice(dateRangeStart.getMonth(), dateRangeEnd.getMonth() + 1).map(
        (m) => ({
          month: m,
          actualAmount: 0,
          assignedAmount: 0,
        }),
      ),
    ]),
  );

  categoryStatistics.forEach((c) => {
    c.subcategories.forEach((s) => {
      s.assignments?.forEach((a) => {
        if (barChartData["All"][a.month.month - 1]) {
          barChartData["All"][a.month.month - 1].actualAmount +=
            a.actualAmount.amount;
          barChartData["All"][a.month.month - 1].assignedAmount +=
            a.assignedAmount.amount;
        }

        if (barChartData[c.categoryName][a.month.month - 1]) {
          barChartData[c.categoryName][a.month.month - 1].actualAmount +=
            a.actualAmount.amount;
          barChartData[c.categoryName][a.month.month - 1].assignedAmount +=
            a.assignedAmount.amount;
        }
      });
    });
  });

  const chartConfig = {
    actualAmount: {
      label: "Actual Amount",
      color: "#2563eb",
    },
    assignedAmount: {
      label: "Assigned Amount",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const [selectedData, setSelectedData] = useState("All");

  console.log(barChartData);

  return (
    <div>
      <Select value={selectedData} onValueChange={setSelectedData}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(barChartData).map((k) => (
            <SelectItem value={k} key={k}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={barChartData[selectedData]}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <LineChart accessibilityLayer />
          <Bar
            dataKey="actualAmount"
            fill="var(--color-primary)"
            radius={4}
            minPointSize={4}
          />
          <Bar
            dataKey="assignedAmount"
            fill="var(--primary-dark)"
            radius={4}
            minPointSize={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default StatisticsCategoryBarChart;
