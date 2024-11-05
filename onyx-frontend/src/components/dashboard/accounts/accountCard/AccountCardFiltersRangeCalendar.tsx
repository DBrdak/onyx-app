import { FC, memo, useState } from "react";
import { endOfDay, format, startOfDay, subYears } from "date-fns";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";
import {
  useAccountDateRangeEnd,
  useAccountDateRangeStart,
  useAccountStore,
} from "@/store/dashboard/accountStore";

const AccountCardFiltersRangeCalendar: FC = () => {
  const dateRangeStart = useAccountDateRangeStart();
  const dateRangeEnd = useAccountDateRangeEnd();
  const accPeriod = useAccountStore.use.accountPeriod();
  const setAccountPeriod = useAccountStore.use.setAccountPeriod();
  const setAccountDateRangeStart =
    useAccountStore.use.setAccountDateRangeStart();
  const setAccountDateRangeEnd = useAccountStore.use.setAccountDateRangeEnd();

  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    accPeriod === "range" && dateRangeStart && dateRangeEnd
      ? {
          from: new Date(dateRangeStart),
          to: new Date(dateRangeEnd),
        }
      : undefined,
  );

  const onRangeSelect = (newDateRange: DateRange | undefined) => {
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

    if (newDateRange.from && newDateRange.to) {
      setAccountPeriod("range");
      setAccountDateRangeStart(startOfDay(newDateRange.from));
      setAccountDateRangeEnd(endOfDay(newDateRange.to));
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
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  );
};

const MemoizedAccountCardFiltersRangeCalendar = memo(
  AccountCardFiltersRangeCalendar,
);
export default MemoizedAccountCardFiltersRangeCalendar;
