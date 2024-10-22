import { FC, useState } from "react";
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
import { getTransactionsQueryKey } from "@/lib/api/transaction";
import {
  useAccountActions,
  useAccountDate,
  useAccountId,
  useAccountPeriod,
} from "@/store/dashboard/accountStore";

const AccountCardFiltersDayCalendar: FC = () => {
  const queryClient = useQueryClient();
  const accPeriod = useAccountPeriod();
  const accDate = useAccountDate();
  const accountId = useAccountId();
  const { setAccountDate } = useAccountActions();
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    accPeriod === "day" ? new Date(accDate) : "",
  );

  const onDateSelected = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDay(date);
    setAccountDate(convertLocalToISOString(date));
    await queryClient.invalidateQueries({
      queryKey: getTransactionsQueryKey(accountId),
    });
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
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersDayCalendar;
