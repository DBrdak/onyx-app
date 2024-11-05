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
import {
  useAccountDateRangeStart,
  useAccountStore,
} from "@/store/dashboard/accountStore";

const AccountCardFiltersDayCalendar: FC = () => {
  const accPeriod = useAccountStore.use.accountPeriod();
  const dayStart = useAccountDateRangeStart();
  const setAccountPeriod = useAccountStore.use.setAccountPeriod();
  const setAccountDateRangeStart =
    useAccountStore.use.setAccountDateRangeStart();
  const setAccountDateRangeEnd = useAccountStore.use.setAccountDateRangeEnd();

  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    accPeriod === "day" ? dayStart : undefined,
  );

  const onDateSelected = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDay(date);
    setAccountPeriod("day");
    setAccountDateRangeStart(startOfDay(date));
    setAccountDateRangeEnd(endOfDay(date));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left",
            !selectedDay && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          <span className="pr-2">
            {selectedDay ? format(selectedDay as Date, "PP") : "Pick a day"}
          </span>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDay as Date}
          onSelect={(date) => onDateSelected(date)}
          disabled={(date) => date > new Date()}
          toDate={new Date()}
          fromDate={subYears(new Date(), 5)}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  );
};

const MemoizedAccountCardFiltersDayCalendar = memo(
  AccountCardFiltersDayCalendar,
);
export default MemoizedAccountCardFiltersDayCalendar;
