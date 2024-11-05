import { FC, memo } from "react";

import MonthsCalendarPopover from "../../MonthsCalendarPopover";
import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";
import {
  useAccountDateRangeStart,
  useAccountStore,
} from "@/store/dashboard/accountStore";
import { getMonthRange } from "@/lib/dates";

const AccountCardFiltersMonthCalendar: FC = () => {
  const accPeriod = useAccountStore.use.accountPeriod();
  const monthFrom = useAccountDateRangeStart();
  const setAccountPeriod = useAccountStore.use.setAccountPeriod();
  const setAccountDateRangeStart =
    useAccountStore.use.setAccountDateRangeStart();
  const setAccountDateRangeEnd = useAccountStore.use.setAccountDateRangeEnd();

  const handleMonthSelect = (newMonthDate: Date) => {
    const { from, to } = getMonthRange(newMonthDate);
    if (!from || !to) return;
    setAccountPeriod("month");
    setAccountDateRangeStart(from);
    setAccountDateRangeEnd(to);
  };

  return (
    <MonthsCalendarPopover
      defaultMonthDate={accPeriod === "month" ? new Date(monthFrom) : undefined}
      onSelect={(newMonthDate) => handleMonthSelect(newMonthDate)}
      monthSelectDisabled={(monthIndex, selectedYear) =>
        monthIndex > DEFAULT_MONTH_NUMBER - 1 &&
        selectedYear === DEFAULT_YEAR_NUMBER
      }
      increaseYearDisabled={(nextYear) => nextYear > DEFAULT_YEAR_NUMBER}
    />
  );
};

const MemoizedAccountCardFiltersMonthCalendar = memo(
  AccountCardFiltersMonthCalendar,
);
export default MemoizedAccountCardFiltersMonthCalendar;
