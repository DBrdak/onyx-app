import { FC, useEffect, useMemo, useState } from "react";

import StatisticsBarChart from "@/components/dashboard/statistics/statisticsBarChart/StatisticsBarChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createInitialChartData } from "@/lib/utils";
import {
  type TStatisticsWithEarnedAmountSchema,
  TStatisticsWithAssignedAmountSchema,
} from "@/lib/validation/statistics";
import { ChartConfig } from "@/components/ui/chart";

interface DropdownStatisticsBarChartProps {
  statistics: Record<
    string,
    TStatisticsWithAssignedAmountSchema[] | TStatisticsWithEarnedAmountSchema[]
  >;
  fromDate: Date;
  toDate: Date;
  barKeys: string[];
  header: string;
  customLegendContent?: Record<string, string>;
  unit?: string;
  customDropdownKeys?: string[];
  onSelectedChange?: (value: string) => void;
}

const DropdownStatisticsBarChart: FC<DropdownStatisticsBarChartProps> = ({
  statistics,
  fromDate,
  toDate,
  barKeys,
  header,
  customLegendContent,
  unit,
  customDropdownKeys,
  onSelectedChange,
}) => {
  const dropdownKeys = useMemo(
    () => (customDropdownKeys ? customDropdownKeys : Object.keys(statistics)),
    [statistics, customDropdownKeys],
  );
  const defaultKey = useMemo(
    () => (dropdownKeys.includes("all") ? "all" : dropdownKeys[0]),
    [dropdownKeys],
  );

  const [selected, setSelected] = useState(defaultKey);

  useEffect(() => {
    setSelected(defaultKey);
  }, [dropdownKeys, defaultKey]);

  const chartData = useMemo(() => {
    const validSelected = dropdownKeys.includes(selected)
      ? selected
      : defaultKey;
    const initializedData = createInitialChartData(fromDate, toDate, barKeys);

    const lookup = new Map<string, Record<string, number>>();
    if (!statistics[validSelected]) return initializedData;

    statistics[validSelected].forEach((stat) => {
      const key = `${stat.month.month}-${stat.month.year}`;

      if (!lookup.has(key)) {
        lookup.set(
          key,
          barKeys.reduce((acc, barKey) => ({ ...acc, [barKey]: 0 }), {}),
        );
      }

      const value = lookup.get(key)!;

      barKeys.forEach((barKey) => {
        const money = stat[barKey as keyof typeof stat];
        if (money && typeof money === "object" && "amount" in money) {
          value[barKey] = (value[barKey] || 0) + (money.amount || 0);
        }
      });
    });

    return initializedData.map((initialData) => {
      const key = `${initialData.month}-${initialData.year}`;
      const values = lookup.get(key) || {};
      return {
        ...initialData,
        ...values,
      };
    });
  }, [fromDate, toDate, selected, statistics]);

  const chartConfig = useMemo(() => {
    const colors = ["hsl(var(--primary))", "hsl(var(--primary-dark))"];
    return {
      [barKeys[0]]: {
        label: barKeys[0].replace("Amount", ""),
        color: colors[0],
      },
      [barKeys[1]]: {
        label: [barKeys[1].replace("Amount", "")],
        color: colors[1],
      },
    };
  }, [barKeys]) satisfies ChartConfig;

  const handleSelectedChange = (value: string) => {
    setSelected(value);
    if (onSelectedChange) {
      onSelectedChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Select value={selected} onValueChange={handleSelectedChange}>
          <SelectTrigger className="h-9 w-max space-x-2 rounded-xl px-4">
            <h3 className="text-sm">{header}</h3>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dropdownKeys.map((k) => (
              <SelectItem value={k} key={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <StatisticsBarChart
        chartData={chartData}
        chartConfig={chartConfig}
        barKeys={barKeys}
        xAxisKey="monthName"
        customLegendContent={customLegendContent}
        unit={unit}
      />
    </div>
  );
};

export default DropdownStatisticsBarChart;
