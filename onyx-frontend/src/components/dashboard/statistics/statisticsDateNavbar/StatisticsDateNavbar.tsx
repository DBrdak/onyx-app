import { FC, useEffect, useRef, useState } from "react";

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

const StatisticsDateNavbar: FC = () => {
  const statisticsDateRangeStart = useStatisticsDateRangeStart();
  const statisticsDateRangeEnd = useStatisticsDateRangeEnd();
  const selectedYear = statisticsDateRangeStart.getFullYear().toString();
  const setStatisticsDateRangeEnd =
    useStatisticsStore.use.setStatisticsDateRangeEnd();
  const setStatisticsDateRangeStart =
    useStatisticsStore.use.setStatisticsDateRangeStart();

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
      tempSelectedMonthEndRef.current.removeSelectedDate();
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

  return (
    <Card className="space-y-2 p-2 md:flex md:space-x-6 md:space-y-0">
      <div className="flex w-full items-center space-x-2">
        <p className="min-w-12 text-sm font-medium tracking-wide md:min-w-fit">
          Year:
        </p>
        <StatisticsDateNavbarYearSelect
          setTempSelectedYear={onTempYearSelect}
          tempSelectedYear={tempSelectedYear}
        />
      </div>
      <div className="flex w-full items-center space-x-2">
        <p className="min-w-12 text-sm font-medium tracking-wide md:min-w-fit">
          From:
        </p>
        <MonthsCalendarPopover
          ref={tempSelectedMonthFromRef}
          defaultMonthDate={statisticsDateRangeStart}
          onSelect={onTempMonthStartSelect}
          increaseYearDisabled={(nextYear) => nextYear > parseInt(selectedYear)}
          decreaseYearDisabled={(nextYear) => nextYear < parseInt(selectedYear)}
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
          ref={tempSelectedMonthEndRef}
          onSelect={onTempMonthEndSelect}
          defaultMonthDate={statisticsDateRangeEnd}
          increaseYearDisabled={(nextYear) => nextYear > parseInt(selectedYear)}
          decreaseYearDisabled={(nextYear) => nextYear < parseInt(selectedYear)}
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
  );
};

export default StatisticsDateNavbar;
