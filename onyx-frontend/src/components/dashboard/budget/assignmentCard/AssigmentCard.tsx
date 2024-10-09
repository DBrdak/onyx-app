import { FC, useMemo, useRef } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Money } from "@/lib/validation/base";
import { cn, getFormattedCurrency } from "@/lib/utils";
import { getToAssignQueryKey } from "@/lib/api/budget";
import DatesMonthYearPickerButtons from "../../DatesMonthYearPickerButtons";
import MonthsCalendarPopover, {
  AvailableDates,
  MonthsCalendarPopoverHandle,
} from "../../MonthsCalendarPopover";

interface AssignmentCardProps {
  toAssign: Money;
  availableDates: AvailableDates;
}

const AssignmentCard: FC<AssignmentCardProps> = ({
  toAssign,
  availableDates,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { budgetId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/",
  });
  const { amount, currency } = toAssign;
  const { month: selectedMonth, year: selectedYear } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/",
  });

  const isFetching = useIsFetching({ queryKey: ["toAssign", budgetId] }) > 0;

  const numericSearchParamsMonth = Number(selectedMonth);
  const numericSearchParamsYear = Number(selectedYear);

  const years = Object.keys(availableDates).map((y) => Number(y));
  const months = availableDates[numericSearchParamsYear] || [];
  const monthIndex = months.indexOf(numericSearchParamsMonth - 1);

  const isMinMonth = useMemo(() => monthIndex === 0, [monthIndex]);
  const isMaxMonth = useMemo(
    () => monthIndex === months.length - 1,
    [monthIndex, months.length],
  );

  const calendarRef = useRef<MonthsCalendarPopoverHandle>(null);

  const handleMonthChange = async (newMonthDate: Date) => {
    await navigate({
      search: (prev) => ({
        ...prev,
        month: (newMonthDate.getMonth() + 1).toString(),
        year: newMonthDate.getFullYear().toString(),
      }),
      mask: "/budget/$budgetId/accounts/$accountId",
    });
    queryClient.refetchQueries({ queryKey: getToAssignQueryKey(budgetId) });
  };

  const handleDecreaseMonth = () => {
    if (isMinMonth || isFetching) return;
    calendarRef.current?.decreaseMonth();
  };

  const handleIncreaseMonth = () => {
    if (isMaxMonth || isFetching) return;
    calendarRef.current?.increaseMonth();
  };

  return (
    <Card>
      <div className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <CardTitle className="flex items-center justify-between">
            <MonthsCalendarPopover
              ref={calendarRef}
              onSelect={handleMonthChange}
              defaultMonthDate={
                new Date(
                  numericSearchParamsYear,
                  numericSearchParamsMonth - 1,
                  1,
                )
              }
              availableYears={years}
              monthSelectDisabled={(monthIndex) => !months.includes(monthIndex)}
              decreaseYearDisabled={(nextYear) => !years.includes(nextYear)}
              increaseYearDisabled={(nextYear) => !years.includes(nextYear)}
              triggerClassname="text-xl border-none pl-1"
            />
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Select a month and display the amount to assign.
          </CardDescription>
        </div>
        <DatesMonthYearPickerButtons
          decreaseButtonDisabled={isFetching || isMinMonth}
          handleDecreaseMonth={handleDecreaseMonth}
          handleIncreaseMonth={handleIncreaseMonth}
          increaseButtonDisabled={isMaxMonth || isFetching}
        />
      </div>
      <CardContent>
        <div className="w-full space-x-4 rounded-lg bg-primary px-4 py-2 text-start text-primary-foreground">
          <p className="text-xs tracking-wide">TO ASSIGN:</p>
          <p
            className={cn(
              "text-center text-lg tracking-wide",
              isFetching && "opacity-50",
            )}
          >
            {getFormattedCurrency(amount, currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
