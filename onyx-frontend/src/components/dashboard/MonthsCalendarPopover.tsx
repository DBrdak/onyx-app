import { useState, useMemo, useImperativeHandle, forwardRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_YEAR_NUMBER, MONTHS } from "@/lib/constants/date";

export interface AvailableDates {
  [key: number]: number[];
}

interface MonthsCalendarPopoverProps {
  defaultMonthDate?: Date;
  availableYears?: number[];
  decreaseYearDisabled?: (nextYear: number) => boolean;
  increaseYearDisabled?: (nextYear: number) => boolean;
  monthSelectDisabled?: (
    selectedMonthIndex: number,
    currentYear: number,
  ) => boolean;
  onSelect: (newMonthDate: Date) => void;
  triggerClassname?: string;
}

export interface MonthsCalendarPopoverHandle {
  increaseMonth: () => void;
  decreaseMonth: () => void;
  removeSelectedDate: () => void;
}

const MonthsCalendarPopover = forwardRef<
  MonthsCalendarPopoverHandle,
  MonthsCalendarPopoverProps
>(
  (
    {
      defaultMonthDate,
      availableYears,
      decreaseYearDisabled,
      increaseYearDisabled,
      monthSelectDisabled,
      onSelect,
      triggerClassname,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      defaultMonthDate || undefined,
    );
    const [displayYear, setDisplayYear] = useState<number>(
      defaultMonthDate?.getFullYear() || DEFAULT_YEAR_NUMBER,
    );

    const years = useMemo(() => {
      if (availableYears && availableYears.length > 0) {
        return availableYears;
      }
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    }, [availableYears]);

    const previousYear = useMemo(() => {
      const currentYearIndex = years.indexOf(displayYear);
      return currentYearIndex > 0 ? years[currentYearIndex - 1] : null;
    }, [years, displayYear]);

    const nextYear = useMemo(() => {
      const currentYearIndex = years.indexOf(displayYear);
      return currentYearIndex < years.length - 1
        ? years[currentYearIndex + 1]
        : null;
    }, [years, displayYear]);

    const changeMonth = (increment: number) => {
      if (!selectedDate) return;
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + increment);
      setSelectedDate(newDate);
      setDisplayYear(newDate.getFullYear());
      onSelect(newDate);
    };

    useImperativeHandle(ref, () => ({
      increaseMonth: () => changeMonth(1),
      decreaseMonth: () => changeMonth(-1),
      removeSelectedDate: () => setSelectedDate(undefined),
    }));

    const goToPreviousYear = () => {
      if (previousYear) {
        setDisplayYear(previousYear);
      }
    };

    const goToNextYear = () => {
      if (nextYear) {
        setDisplayYear(nextYear);
      }
    };

    const handleMonthSelect = (monthIndex: number) => {
      const newDate = new Date(displayYear, monthIndex, 1);
      setSelectedDate(newDate);
      onSelect(newDate);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full pl-3 text-left", triggerClassname)}
            onClick={() => setOpen(true)}
          >
            <span className="pr-2">
              {selectedDate
                ? format(selectedDate, "LLLL yyyy")
                : "Pick a month"}
            </span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="mb-2 grid grid-cols-3 place-items-center gap-1">
            <div>
              {previousYear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousYear}
                  disabled={
                    decreaseYearDisabled && decreaseYearDisabled(previousYear)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  {previousYear}
                </Button>
              )}
            </div>
            <span className="text-lg font-medium">{displayYear}</span>
            <div>
              {nextYear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextYear}
                  disabled={
                    increaseYearDisabled && increaseYearDisabled(nextYear)
                  }
                >
                  {nextYear}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((month, index) => (
              <Button
                size="sm"
                key={month}
                variant={
                  selectedDate?.getMonth() === index &&
                  selectedDate?.getFullYear() === displayYear
                    ? "default"
                    : "outline"
                }
                onClick={() => handleMonthSelect(index)}
                disabled={
                  monthSelectDisabled && monthSelectDisabled(index, displayYear)
                }
              >
                {month}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

export default MonthsCalendarPopover;
