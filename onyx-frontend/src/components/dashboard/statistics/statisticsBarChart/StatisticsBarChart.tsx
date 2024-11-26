import { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StatisticsBarChartProps {
  chartConfig: ChartConfig;
  chartData: Record<string, string | number>[];
  xAxisKey: string;
  barKeys: string[];
  customTooltipContent?: Record<string, string>;
  customLegendContent?: Record<string, string>;
}

const StatisticsBarChart: FC<StatisticsBarChartProps> = ({
  chartConfig,
  chartData,
  xAxisKey,
  barKeys,
  customLegendContent,
  customTooltipContent,
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[350px] min-h-[200px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip
          content={<ChartTooltipContent custom={customTooltipContent} />}
        />
        <ChartLegend
          content={<ChartLegendContent custom={customLegendContent} />}
        />
        <LineChart accessibilityLayer />
        <Bar
          dataKey={barKeys[0]}
          radius={4}
          minPointSize={4}
          fill="hsl(var(--primary))"
          maxBarSize={50}
        />
        <Bar
          dataKey={barKeys[1]}
          radius={4}
          minPointSize={4}
          fill="hsl(var(--primary-dark))"
          maxBarSize={50}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default StatisticsBarChart;
