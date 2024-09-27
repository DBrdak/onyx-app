import { FC, useState } from "react";
import { format } from "date-fns";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
  MONTHS,
} from "@/lib/constants/date";
import { getTransactionsQueryKey } from "@/lib/api/transaction";

const AccountCardFiltersMonthCalendar: FC = () => {
  const { accDate, accPeriod } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(
    accPeriod === "month" ? new Date(accDate) : undefined,
  );
  const [currentYear, setCurrentYear] = useState<number>(
    accPeriod === "month"
      ? new Date(accDate).getFullYear()
      : new Date().getFullYear(),
  );

  const handleMonthSelect = async (monthIndex: number) => {
    const selectedDate = new Date(currentYear, monthIndex, 1);
    setSelectedMonth(selectedDate);

    await navigate({
      search: (prev) => ({
        ...prev,
        accPeriod: "month",
        accDate: format(
          new Date(`${currentYear}-${monthIndex + 1}-01`),
          "yyyy-MM-dd",
        ),
      }),
      mask: "/budget/$budgetId/accounts/$accountId",
    });
    await queryClient.invalidateQueries({
      queryKey: getTransactionsQueryKey(accountId),
    });

    setOpen(false);
  };

  const goToPreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const goToNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left",
            !selectedMonth && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          {selectedMonth ? (
            format(selectedMonth, "LLLL yyyy")
          ) : (
            <span>Pick a month</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="mb-2 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goToPreviousYear}>
            <ChevronLeft className="h-4 w-4" />
            {currentYear - 1}
          </Button>
          <span className="text-lg font-medium">{currentYear}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextYear}
            disabled={currentYear >= DEFAULT_YEAR_NUMBER}
          >
            {currentYear + 1}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((month, index) => (
            <Button
              size="sm"
              key={month}
              variant={
                selectedMonth?.getMonth() === index &&
                selectedMonth?.getFullYear() === currentYear
                  ? "default"
                  : "outline"
              }
              onClick={() => handleMonthSelect(index)}
              disabled={
                currentYear >= DEFAULT_YEAR_NUMBER &&
                index + 1 > DEFAULT_MONTH_NUMBER
              }
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccountCardFiltersMonthCalendar;
