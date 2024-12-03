import { FC, useMemo, useState } from "react";

import { type TStatisticsValueSchema } from "@/lib/validation/statistics";
import DropdownStatisticsBarChart from "../statisticsBarChart/DropdownStatisticsBarChart";
import {
  useStatisticsDateRangeEnd,
  useStatisticsDateRangeStart,
} from "@/store/dashboard/statisticsStore";
import { Card } from "@/components/ui/card";
import StatisticsSharedPieCharts from "../statisticsPieChart/StatisticsSharedPieCharts";

interface StatisticsCategoryChartsProps {
  statistics: TStatisticsValueSchema;
}

const StatisticsCategoryCharts: FC<StatisticsCategoryChartsProps> = ({
  statistics,
}) => {
  const categories = statistics.categories.data;
  const subcategories = statistics.subcategories.data;

  const categoriesKeys = useMemo(
    () => Object.keys(categories).filter((c) => c.toLowerCase() !== "all"),
    [categories],
  );
  const allSubcategoriesKeys = Object.keys(subcategories);
  const [subcategoriesKeys, setSubcategoriesKeys] =
    useState(allSubcategoriesKeys);

  const statisticsDateStart = useStatisticsDateRangeStart();
  const statisticsDateRangeEnd = useStatisticsDateRangeEnd();

  const onSelectCategoryDropdown = (value: string) => {
    if (categories[value][0].subcategories) {
      setSubcategoriesKeys(
        Object.keys(categories[value][0].subcategories).map((k) =>
          k.toLowerCase(),
        ),
      );
    }
  };

  const currency =
    subcategories[subcategoriesKeys[0]][0].assignedAmount.currency;

  return (
    <div className="space-y-14">
      <Card className="px-2 py-4">
        <DropdownStatisticsBarChart
          statistics={categories}
          barKeys={["assignedAmount", "spentAmount"]}
          fromDate={statisticsDateStart}
          toDate={statisticsDateRangeEnd}
          header="Category:"
          onSelectedChange={onSelectCategoryDropdown}
          unit={currency}
        />
      </Card>

      <StatisticsSharedPieCharts
        statistics={categories}
        fromDate={statisticsDateStart}
        toDate={statisticsDateRangeEnd}
        pieKeys={["spentAmount", "assignedAmount"]}
        statisticsKeys={categoriesKeys}
        title="Categories"
      />

      <Card className="px-2 py-4">
        <DropdownStatisticsBarChart
          statistics={subcategories}
          barKeys={["assignedAmount", "spentAmount"]}
          fromDate={statisticsDateStart}
          toDate={statisticsDateRangeEnd}
          header="Subcategory:"
          customDropdownKeys={subcategoriesKeys}
          unit={currency}
        />
      </Card>

      <StatisticsSharedPieCharts
        statistics={subcategories}
        fromDate={statisticsDateStart}
        toDate={statisticsDateRangeEnd}
        pieKeys={["spentAmount", "assignedAmount"]}
        statisticsKeys={allSubcategoriesKeys}
        title="Subcategories"
      />
    </div>
  );
};

export default StatisticsCategoryCharts;
