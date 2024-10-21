import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, subYears } from "date-fns";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn, convertLocalToISOString } from "@/lib/utils";
import { type DateRange } from "react-day-picker";
import { getTransactionsQueryKey } from "@/lib/api/transaction";
import {
  useAccountActions,
  useAccountDateRangeEnd,
  useAccountDateRangeStart,
  useAccountId,
  useAccountPeriod,
} from "@/store/dashboard/accountStore";

const AccountCardFiltersRangeCalendar = () => {
  const queryClient = useQueryClient();
  const dateRangeStart = useAccountDateRangeStart();
  const dateRangeEnd = useAccountDateRangeEnd();
  const accPeriod = useAccountPeriod();
  const accountId = useAccountId();
  const { setAccountDateRangeEnd, setAccountDateRangeStart, setAccountPeriod } =
    useAccountActions();

  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    accPeriod === "range" && dateRangeStart && dateRangeEnd
      ? {
          from: new Date(dateRangeStart),
          to: new Date(dateRangeEnd),
        }
      : undefined,
  );

  const onRangeSelect = async (newDateRange: DateRange | undefined) => {
    if (!newDateRange) return;

    if (
      newDateRange.from &&
      newDateRange.to &&
      dateRange?.from &&
      dateRange?.to
    ) {
      return setDateRange(undefined);
    } else {
      setDateRange(newDateRange);
    }

    const formattedStartDate = newDateRange.from
      ? convertLocalToISOString(newDateRange.from)
      : "";
    const formattedEndDate = newDateRange.to
      ? convertLocalToISOString(newDateRange.to)
      : "";

    if (formattedStartDate && formattedEndDate) {
      setAccountPeriod("range");
      setAccountDateRangeStart(formattedStartDate);
      setAccountDateRangeEnd(formattedEndDate);
      await queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey(accountId),
      });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left",
            !dateRange && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                {format(dateRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy")
            )
          ) : (
            <>
              <span>Pick a range</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={dateRange}
          onSelect={(newRange) => onRangeSelect(newRange)}
          disabled={(date) => date > new Date()}
          toDate={new Date()}
          fromDate={subYears(new Date(), 5)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersRangeCalendar;
