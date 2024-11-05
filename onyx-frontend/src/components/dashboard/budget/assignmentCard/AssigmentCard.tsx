import { FC, useMemo, useRef } from "react";
import { useIsFetching } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Money } from "@/lib/validation/base";
import { cn, getFormattedCurrency } from "@/lib/utils";
import DatesMonthYearPickerButtons from "../../DatesMonthYearPickerButtons";
import MonthsCalendarPopover, {
  AvailableDates,
  MonthsCalendarPopoverHandle,
} from "../../MonthsCalendarPopover";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

interface AssignmentCardProps {
  toAssign: Money;
  availableDates: AvailableDates;
}

const AssignmentCard: FC<AssignmentCardProps> = ({
  toAssign,
  availableDates,
}) => {
  const { amount, currency } = toAssign;
  const budgetId = useBudgetStore.use.budgetId();
  const month = useBudgetStore.use.budgetMonth();
  const year = useBudgetStore.use.budgetYear();
  const setBudgetMonth = useBudgetStore.use.setBudgetMonth();
  const setBudgetYear = useBudgetStore.use.setBudgetYear();

  const isFetching = useIsFetching({ queryKey: ["toAssign", budgetId] }) > 0;

  const years = Object.keys(availableDates).map((y) => Number(y));
  const months = availableDates[year] || [];
  const monthIndex = months.indexOf(month - 1);

  const isMinMonth = useMemo(() => monthIndex === 0, [monthIndex]);
  const isMaxMonth = useMemo(
    () => monthIndex === months.length - 1,
    [monthIndex, months.length],
  );

  const calendarRef = useRef<MonthsCalendarPopoverHandle>(null);

  const handleMonthChange = async (newMonthDate: Date) => {
    setBudgetMonth(newMonthDate.getMonth() + 1);
    setBudgetYear(newMonthDate.getFullYear());
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
              defaultMonthDate={new Date(year, month - 1, 1)}
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
