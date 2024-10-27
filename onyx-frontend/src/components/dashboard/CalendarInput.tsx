import { useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { isInPastRange } from "@/lib/dates";

interface CalendarInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;

  className?: string;
}
const CalendarInput = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  className,
}: CalendarInputProps<TFieldValues, TName>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left",
              !field.value && "text-muted-foreground",
              className,
            )}
            onClick={() => setOpen(true)}
          >
            {field.value ? (
              format(new Date(field.value), "PP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(date) => {
            if (!date) return;
            field.onChange(date);
            setOpen(false);
          }}
          disabled={(date) => !isInPastRange(date, 5)}
          initialFocus
          disableNavigation
          defaultMonth={field.value}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarInput;
