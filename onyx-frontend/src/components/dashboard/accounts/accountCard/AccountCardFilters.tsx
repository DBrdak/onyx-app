import { FC, useEffect, useState } from "react";

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

import { getLastDays } from "@/lib/dates";
import { useAccountStore } from "@/store/dashboard/accountStore";

interface AccountCardFiltersProps {
  disabled: boolean;
}

const AccountCardFilters: FC<AccountCardFiltersProps> = ({ disabled }) => {
  const accPeriod = useAccountStore.use.accountPeriod();
  const setAccountPeriod = useAccountStore.use.setAccountPeriod();
  const setAccountDateRangeStart =
    useAccountStore.use.setAccountDateRangeStart();
  const setAccountDateRangeEnd = useAccountStore.use.setAccountDateRangeEnd();

  const [localPeriod, setLocalPeriod] = useState(() => accPeriod);

  useEffect(() => {
    if (localPeriod !== accPeriod) {
      setLocalPeriod(accPeriod);
    }
  }, [accPeriod]);

  const handleSelectChange = (value: (typeof DATE_PERIOD_OPTIONS)[number]) => {
    setLocalPeriod(value);

    if (value === "last30days" || value === "last7days") {
      const { from, to } = getLastDays(
        new Date(),
        value === "last30days" ? 30 : 7,
      );
      if (!from || !to) return;
      setAccountPeriod(value);
      setAccountDateRangeStart(from);
      setAccountDateRangeEnd(to);
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
          value={localPeriod}
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
        {localPeriod === "day" && <AccountCardFiltersDayCalendar />}
        {localPeriod === "week" && <AccountCardFiltersWeekCalendar />}
        {localPeriod === "month" && <AccountCardFiltersMonthCalendar />}
        {localPeriod === "range" && <AccountCardFiltersRangeCalendar />}
      </div>
    </div>
  );
};

export default AccountCardFilters;
