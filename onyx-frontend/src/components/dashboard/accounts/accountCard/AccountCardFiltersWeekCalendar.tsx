import { FC, memo, useState } from "react";
import { format, subYears } from "date-fns";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  useAccountDateRangeEnd,
  useAccountDateRangeStart,
  useAccountStore,
} from "@/store/dashboard/accountStore";
import { getWeekRange } from "@/lib/dates";

const AccountCardFiltersWeekCalendar: FC = () => {
  const accPeriod = useAccountStore.use.accountPeriod();
  const weekRangeStart = useAccountDateRangeStart();
  const weekRangeEnd = useAccountDateRangeEnd();
  const setAccountPeriod = useAccountStore.use.setAccountPeriod();
  const setAccountDateRangeStart =
    useAccountStore.use.setAccountDateRangeStart();
  const setAccountDateRangeEnd = useAccountStore.use.setAccountDateRangeEnd();

  const [open, setOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>(
    accPeriod === "week"
      ? {
          from: weekRangeStart,
          to: weekRangeEnd,
        }
      : undefined,
  );

  const handleDayClick = (date: Date) => {
    const range = getWeekRange(date);
    if (!range.from || !range.to) return;
    setSelectedWeek(range);
    setAccountPeriod("week");
    setAccountDateRangeStart(range.from);
    setAccountDateRangeEnd(range.to);
    setOpen(false);
  };

  const isDayInSelectedWeek = (date: Date): boolean => {
    if (!selectedWeek) return false;
    const { from, to } = selectedWeek;
    return date >= from! && date <= to!;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left",
            !selectedWeek && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          {selectedWeek?.from ? (
            selectedWeek.to ? (
              <>
                {format(selectedWeek.from, "dd")} -{" "}
                {format(selectedWeek.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(selectedWeek.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Pick a week</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={undefined}
          onDayClick={handleDayClick}
          modifiers={{
            selected: isDayInSelectedWeek,
          }}
          disabled={(date) => date > new Date()}
          toDate={new Date()}
          fromDate={subYears(new Date(), 5)}
        />
      </PopoverContent>
    </Popover>
  );
};

const MemoizedAccountCardFiltersWeekCalendar = memo(
  AccountCardFiltersWeekCalendar,
);
export default MemoizedAccountCardFiltersWeekCalendar;
