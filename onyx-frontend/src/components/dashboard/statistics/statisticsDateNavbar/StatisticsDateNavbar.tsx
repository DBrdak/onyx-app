import { FC, useEffect, useRef, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

import StatisticsDateNavbarYearSelect from "@/components/dashboard/statistics/statisticsDateNavbar/StatisticsDateNavbarYearSelect";
import MonthsCalendarPopover, {
  MonthsCalendarPopoverHandle,
} from "@/components/dashboard/MonthsCalendarPopover";
import { Card } from "@/components/ui/card";

import {
  useStatisticsDateRangeEnd,
  useStatisticsDateRangeStart,
  useStatisticsStore,
} from "@/store/dashboard/statisticsStore";
import { getStatisticsQueryOptions } from "@/lib/api/statistics";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

const StatisticsDateNavbar: FC = () => {
  const statisticsDateRangeStart = useStatisticsDateRangeStart();
  const statisticsDateRangeEnd = useStatisticsDateRangeEnd();
  const selectedYear = statisticsDateRangeStart.getFullYear().toString();
  const setStatisticsDateRangeEnd =
    useStatisticsStore.use.setStatisticsDateRangeEnd();
  const setStatisticsDateRangeStart =
    useStatisticsStore.use.setStatisticsDateRangeStart();
  const budgetId = useBudgetStore.use.budgetId();

  const [tempSelectedYear, setTempSelectedYear] = useState(selectedYear);
  const [tempSelectedMonthFrom, setTempSelectedMonthFrom] = useState<
    Date | undefined
  >(statisticsDateRangeStart);
  const [tempSelectedMonthEnd, setTempSelectedMonthEnd] = useState<
    Date | undefined
  >(statisticsDateRangeEnd);
  const tempSelectedMonthFromRef = useRef<MonthsCalendarPopoverHandle | null>(
    null,
  );
  const tempSelectedMonthEndRef = useRef<MonthsCalendarPopoverHandle | null>(
    null,
  );

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (tempSelectedYear !== selectedYear) {
      setTempSelectedYear(selectedYear);
    }

    if (tempSelectedMonthFrom !== statisticsDateRangeStart) {
      setTempSelectedMonthFrom(statisticsDateRangeStart);
    }

    if (tempSelectedMonthEnd !== statisticsDateRangeEnd) {
      setTempSelectedMonthEnd(statisticsDateRangeEnd);
    }
  }, [statisticsDateRangeStart, statisticsDateRangeEnd]);

  const onTempYearSelect = (newYear: string) => {
    setTempSelectedYear(newYear);
    setTempSelectedMonthEnd(undefined);
    setTempSelectedMonthFrom(undefined);
    if (tempSelectedMonthFromRef.current && tempSelectedMonthEndRef.current) {
      tempSelectedMonthFromRef.current.removeSelectedDate();
      tempSelectedMonthFromRef.current.setDisplayYear(parseInt(newYear));
      tempSelectedMonthEndRef.current.removeSelectedDate();
      tempSelectedMonthEndRef.current.setDisplayYear(parseInt(newYear));
    }
  };

  const onTempMonthStartSelect = (newMonth: Date) => {
    setTempSelectedMonthFrom(newMonth);

    if (tempSelectedMonthEnd) {
      setStatisticsDateRangeEnd(tempSelectedMonthEnd);
      setStatisticsDateRangeStart(newMonth);
    }
  };

  const onTempMonthEndSelect = (newMonth: Date) => {
    setTempSelectedMonthEnd(newMonth);

    if (tempSelectedMonthFrom) {
      setStatisticsDateRangeEnd(newMonth);
      setStatisticsDateRangeStart(tempSelectedMonthFrom);
    }
  };

  const isFetching = useIsFetching({
    queryKey: getStatisticsQueryOptions(budgetId).queryKey,
  });
  const isDisabled = isFetching > 0;

  return (
    <div className="lg:px-4">
      <Card className="space-y-2 p-2 md:flex md:space-x-6 md:space-y-0 ">
        <div className="flex w-full items-center space-x-2">
          <p className="min-w-12 text-sm font-medium tracking-wide md:min-w-fit">
            Year:
          </p>
          <StatisticsDateNavbarYearSelect
            setTempSelectedYear={onTempYearSelect}
            tempSelectedYear={tempSelectedYear}
            disabled={isDisabled}
          />
        </div>
        <div className="flex w-full items-center space-x-2">
          <p className="min-w-12 text-sm font-medium tracking-wide md:min-w-fit">
            From:
          </p>
          <MonthsCalendarPopover
            disabled={isDisabled}
            hideYearsButtons
            ref={tempSelectedMonthFromRef}
            defaultMonthDate={statisticsDateRangeStart}
            onSelect={onTempMonthStartSelect}
            increaseYearDisabled={(nextYear) =>
              nextYear > parseInt(selectedYear)
            }
            decreaseYearDisabled={(nextYear) =>
              nextYear < parseInt(selectedYear)
            }
            monthSelectDisabled={(selectedMonthIndex, selectedYear) => {
              const tempYearNum = parseInt(tempSelectedYear);
              if (tempYearNum !== selectedYear) return true;
              if (selectedMonthIndex > new Date().getMonth()) return true;
              if (!tempSelectedMonthEnd) return false;
              if (selectedMonthIndex >= tempSelectedMonthEnd.getMonth())
                return true;
              return false;
            }}
          />
        </div>
        <div className="flex w-full items-center space-x-2">
          <p className="min-w-12 text-sm font-medium tracking-wide md:min-w-fit">
            To:
          </p>
          <MonthsCalendarPopover
            disabled={isDisabled}
            hideYearsButtons
            ref={tempSelectedMonthEndRef}
            onSelect={onTempMonthEndSelect}
            defaultMonthDate={statisticsDateRangeEnd}
            increaseYearDisabled={(nextYear) =>
              nextYear > parseInt(selectedYear)
            }
            decreaseYearDisabled={(nextYear) =>
              nextYear < parseInt(selectedYear)
            }
            monthSelectDisabled={(selectedMonthIndex, selectedYear) => {
              const tempYearNum = parseInt(tempSelectedYear);
              if (tempYearNum !== selectedYear) return true;
              if (selectedMonthIndex > new Date().getMonth()) return true;
              if (!tempSelectedMonthFrom) return false;
              if (selectedMonthIndex <= tempSelectedMonthFrom.getMonth())
                return true;
              return false;
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default StatisticsDateNavbar;
