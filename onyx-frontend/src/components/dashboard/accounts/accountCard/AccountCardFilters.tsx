import { FC } from "react";
import { useQueryClient } from "@tanstack/react-query";

import AccountCardFiltersDayCalendar from "@/components/dashboard/accounts/accountCard/AccountCardFiltersDayCalendar";
import AccountCardFiltersWeekCalendar from "@/components/dashboard/accounts/accountCard/AccountCardFiltersWeekCalendar";
import AccountCardFiltersMonthCalendar from "@/components/dashboard/accounts/accountCard/AccountCardFiltersMonthCalendar";
import AccountCardFiltersRangeCalendar from "@/components/dashboard/accounts/accountCard/AccountCardFiltersRangeCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DATE_PERIOD_OPTIONS, DATE_PERIOD_SELECT } from "@/lib/constants/date";
import { getTransactionsQueryKey } from "@/lib/api/transaction";

import {
  useAccountActions,
  useAccountId,
  useAccountPeriod,
} from "@/store/dashboard/accountStore";
import { convertLocalToISOString } from "@/lib/utils";

interface AccountCardFiltersProps {
  disabled: boolean;
}

const AccountCardFilters: FC<AccountCardFiltersProps> = ({ disabled }) => {
  const queryClient = useQueryClient();
  const accPeriod = useAccountPeriod();
  const accountId = useAccountId();
  const { setAccountPeriod, setAccountDate } = useAccountActions();

  const handleSelectChange = async (
    value: (typeof DATE_PERIOD_OPTIONS)[number],
  ) => {
    setAccountPeriod(value);
    if (value === "last30days" || value === "last7days") {
      setAccountDate(convertLocalToISOString(new Date()));
      await queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey(accountId),
      });
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        Display data for:
      </p>
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-2 md:gap-y-0">
        <Select
          disabled={disabled}
          value={accPeriod}
          onValueChange={(v) =>
            handleSelectChange(v as (typeof DATE_PERIOD_OPTIONS)[number])
          }
        >
          <SelectTrigger className="w-full bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_PERIOD_SELECT.map((select, index) => (
              <SelectItem key={index} value={select.value}>
                {select.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {accPeriod === "day" && <AccountCardFiltersDayCalendar />}
        {accPeriod === "week" && <AccountCardFiltersWeekCalendar />}
        {accPeriod === "month" && <AccountCardFiltersMonthCalendar />}
        {accPeriod === "range" && <AccountCardFiltersRangeCalendar />}
      </div>
    </div>
  );
};

export default AccountCardFilters;
