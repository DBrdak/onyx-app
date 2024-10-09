import { FC } from "react";
import { format } from "date-fns";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { getTransactionsQueryKey } from "@/lib/api/transaction";
import { SingleBudgetPageSearchParams } from "@/lib/validation/searchParams";
import MonthsCalendarPopover from "../../MonthsCalendarPopover";
import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";

const AccountCardFiltersMonthCalendar: FC = () => {
  const { accDate, accPeriod } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleMonthSelect = async (newMonthDate: Date) => {
    await navigate({
      search: (prev: SingleBudgetPageSearchParams) => ({
        ...prev,
        accPeriod: "month",
        accDate: format(newMonthDate, "yyyy-MM-dd"),
      }),
      mask: "/budget/$budgetId/accounts/$accountId",
    });
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
