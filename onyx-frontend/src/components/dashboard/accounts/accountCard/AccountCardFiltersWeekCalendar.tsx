import { FC, useState } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn, getWeekRange } from "@/lib/utils";
import { getTransactionsQueryKey } from "@/lib/api/transaction";
import { DateRange } from "react-day-picker";

const AccountCardFiltersWeekCalendar: FC = () => {
  const { accDate, accPeriod } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const [open, setOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>(
    accPeriod === "week" ? getWeekRange(new Date(accDate)) : undefined,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDayClick = async (date: Date) => {
    const range = getWeekRange(date);
    setSelectedWeek(range);

    await navigate({
      search: (prev) => ({
        ...prev,
        accPeriod: "week",
        accDate: format(date, "yyyy-MM-dd"),
      }),
      mask: "/budget/$budgetId/accounts/$accountId",
    });
    await queryClient.invalidateQueries({
      queryKey: getTransactionsQueryKey(accountId),
    });
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
          captionLayout="dropdown-buttons"
          toDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersWeekCalendar;
