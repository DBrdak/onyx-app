import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";

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
import { getTransactionsQueryKey } from "@/lib/api/transaction";

const AccountCardFiltersRangeCalendar = () => {
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { accPeriod, dateRangeEnd, dateRangeStart } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    accPeriod === "range"
      ? {
          from: new Date(dateRangeStart!),
          to: new Date(dateRangeEnd!),
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
      ? format(newDateRange.from, "yyyy-MM-dd")
      : "";
    const formattedEndDate = newDateRange.to
      ? format(newDateRange.to, "yyyy-MM-dd")
      : "";

    if (formattedStartDate && formattedEndDate) {
      await navigate({
        search: (prev) => ({
          ...prev,
          accPeriod: "range",
          dateRangeStart: formattedStartDate,
          dateRangeEnd: formattedEndDate,
        }),
        mask: "/budget/$budgetId/accounts/$accountId",
      });
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
            <span>Pick a range</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersRangeCalendar;
