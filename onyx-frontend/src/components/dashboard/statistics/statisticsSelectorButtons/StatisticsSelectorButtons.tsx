import { FC } from "react";

import { Button } from "@/components/ui/button";
import { useStatisticsStore } from "@/store/dashboard/statisticsStore";
import { cn } from "@/lib/utils";

interface StatisticsSelectorButtonsProps {
  selectors: string[];
}

const StatisticsSelectorButtons: FC<StatisticsSelectorButtonsProps> = ({
  selectors,
}) => {
  const activeSelector = useStatisticsStore.use.statisticsSelector();

  return (
    <div className="grid gap-y-2 md:grid-cols-3 md:gap-x-2 md:gap-y-0 lg:px-4 xl:absolute xl:top-8 xl:w-[40%]">
      {selectors.map((s) => (
        <Button
          key={s}
          className={cn(
            "rounded-xl bg-primaryDark/40",
            activeSelector === s && "bg-primary",
          )}
        >
          {s}
        </Button>
      ))}
    </div>
  );
};

export default StatisticsSelectorButtons;
