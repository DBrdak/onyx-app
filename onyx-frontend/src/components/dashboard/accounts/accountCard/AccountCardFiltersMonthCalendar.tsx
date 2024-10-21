import { FC } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getTransactionsQueryKey } from "@/lib/api/transaction";
import MonthsCalendarPopover from "../../MonthsCalendarPopover";
import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";
import {
  useAccountActions,
  useAccountDate,
  useAccountId,
  useAccountPeriod,
} from "@/store/dashboard/accountStore";
import { convertLocalToISOString } from "@/lib/utils";

const AccountCardFiltersMonthCalendar: FC = () => {
  const queryClient = useQueryClient();
  const accPeriod = useAccountPeriod();
  const accDate = useAccountDate();
  const accountId = useAccountId();
  const { setAccountPeriod, setAccountDate } = useAccountActions();

  const handleMonthSelect = async (newMonthDate: Date) => {
    setAccountPeriod("month");
    setAccountDate(convertLocalToISOString(newMonthDate));
    await queryClient.invalidateQueries({
      queryKey: getTransactionsQueryKey(accountId),
    });
  };

  return (
    <MonthsCalendarPopover
      defaultMonthDate={accPeriod === "month" ? new Date(accDate) : undefined}
      onSelect={(newMonthDate) => handleMonthSelect(newMonthDate)}
      monthSelectDisabled={(monthIndex, selectedYear) =>
        monthIndex > DEFAULT_MONTH_NUMBER - 1 &&
        selectedYear === DEFAULT_YEAR_NUMBER
      }
      increaseYearDisabled={(nextYear) => nextYear > DEFAULT_YEAR_NUMBER}
    />
  );
};

export default AccountCardFiltersMonthCalendar;
