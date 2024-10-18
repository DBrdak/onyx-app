import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import AmountInput from "@/components/dashboard/AmountInput";
import MonthsCalendarPopover from "@/components/dashboard/MonthsCalendarPopover";

import { Currency, Target } from "@/lib/validation/base";
import { CreateTarget } from "@/lib/validation/subcategory";
import { FormTarget } from "@/lib/api/subcategory";
import {
  formatToDecimalString,
  formatToDotDecimal,
  getErrorMessage,
} from "@/lib/utils";
import { useCreateTargetMutation } from "@/lib/hooks/mutations/useCreateTargetMutation";
import {
  DEFAULT_MONTH_NUMBER,
  DEFAULT_YEAR_NUMBER,
} from "@/lib/constants/date";
import {
  useBudgetMonth,
  useBudgetYear,
  useSelectedBudgetId,
} from "@/store/dashboard/budgetStore";

interface TargetCardFormProps {
  currentTarget: Target | undefined | null;
  setIsCreating: (state: boolean) => void;
  subcategoryId: string;
  currencyToDisplay: Currency;
}

const TargetCardForm: FC<TargetCardFormProps> = ({
  currentTarget,
  setIsCreating,
  subcategoryId,
  currencyToDisplay,
}) => {
  const selectedBudget = useSelectedBudgetId();
  const selectedMonth = useBudgetMonth();
  const selectedYear = useBudgetYear();
  const { toast } = useToast();

  const isEditing = !!currentTarget;
  const defaultAmount = formatToDecimalString(
    currentTarget?.targetAmount.amount || 0,
  );
  const defaultMonth = currentTarget
    ? currentTarget.upToMonth.month
    : selectedMonth;
  const defaultYear = currentTarget
    ? currentTarget.upToMonth.year
    : selectedYear;

  const form = useForm<CreateTarget>({
    defaultValues: {
      amount: defaultAmount,
      month: defaultMonth.toString(),
      year: defaultYear.toString(),
    },
  });
  const { handleSubmit, control, watch, setValue } = form;
  const inputAmount = watch("amount");
  const inputMonth = watch("month");
  const inputYear = watch("year");

  const onMutationError = (err: Error) => {
    setIsCreating(true);
    const description = getErrorMessage(err);
    toast({
      title: "Error",
      variant: "destructive",
      description,
    });
  };

  const { mutate } = useCreateTargetMutation({
    budgetId: selectedBudget,
    currency: currencyToDisplay,
    onMutationError,
  });

  const onSubmit: SubmitHandler<CreateTarget> = (data) => {
    const { month, year, amount } = data;
    const formattedAmount = formatToDotDecimal(amount);

    const target: FormTarget = {
      targetAmount: Number(formattedAmount),
      startedAt: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      targetUpToMonth: {
        month: Number(month),
        year: Number(year),
      },
    };

    mutate({
      budgetId: selectedBudget,
      subcategoryId,
      formTarget: target,
    });
    setIsCreating(false);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-2">
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 items-center gap-x-1 space-y-0">
                <FormLabel className="col-span-1">Amount:</FormLabel>
                <FormControl>
                  <AmountInput
                    field={field}
                    currency={currencyToDisplay}
                    className="col-span-2 border bg-card text-start"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem className="grid grid-cols-3 items-center gap-x-1 space-y-0">
            <FormLabel className="col-span-1">Up to month:</FormLabel>
            <FormControl>
              <div className="col-span-2 h-10 w-full rounded-md text-sm">
                <MonthsCalendarPopover
                  defaultMonthDate={
                    new Date(Number(defaultYear), Number(defaultMonth) - 1, 1)
                  }
                  onSelect={(newMonthDate) => {
                    setValue("month", (newMonthDate.getMonth() + 1).toString());
                    setValue("year", newMonthDate.getFullYear().toString());
                  }}
                  monthSelectDisabled={(monthIndex, selectedYear) =>
                    monthIndex < DEFAULT_MONTH_NUMBER &&
                    selectedYear === DEFAULT_YEAR_NUMBER
                  }
                  decreaseYearDisabled={(nextYear) =>
                    nextYear < DEFAULT_YEAR_NUMBER
                  }
                />
              </div>
            </FormControl>
          </FormItem>
          <div className="pt-6">
            <Button
              type="submit"
              disabled={
                (Number(inputAmount) === Number(defaultAmount) &&
                  inputMonth === defaultMonth.toString() &&
                  inputYear === defaultYear.toString()) ||
                inputAmount === "0.00" ||
                inputAmount === "0.0" ||
                inputAmount === "0" ||
                inputAmount === "0."
              }
              className="w-full"
            >
              Set target
            </Button>
          </div>
        </form>
      </Form>
      {isEditing && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsCreating(false)}
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default TargetCardForm;
