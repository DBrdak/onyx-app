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

import { cn } from "@/lib/utils";
import { getTransactionsQueryKey } from "@/lib/api/transaction";
import { SingleBudgetPageSearchParams } from "@/lib/validation/searchParams";

const AccountCardFiltersDayCalendar: FC = () => {
  const { accDate, accPeriod } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    accPeriod === "day" ? new Date(accDate) : "",
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
          onSelect={async (date) => {
            if (!date) return;
            setSelectedDay(date);
            await navigate({
              search: (prev: SingleBudgetPageSearchParams) => ({
                ...prev,
                accPeriod: "day",
                accDate: format(date, "yyyy-MM-dd"),
              }),
              mask: "/budget/$budgetId/accounts/$accountId",
            });
            await queryClient.invalidateQueries({
              queryKey: getTransactionsQueryKey(accountId),
            });
            setOpen(false);
          }}
          disabled={(date) => date > new Date()}
          captionLayout="dropdown-buttons"
          toDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersDayCalendar;
