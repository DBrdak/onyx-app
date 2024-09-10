import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useSearch } from "@tanstack/react-router";

import { X } from "lucide-react";
import TargetCardFormDatePicker from "./TargetCardFormDatePicker";
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

import { Target } from "@/lib/validation/base";
import { CreateTarget } from "@/lib/validation/subcategory";
import { FormTarget } from "@/lib/api/subcategory";
import { formatToDecimalString, formatToDotDecimal } from "@/lib/utils";
import { useCreateTargetMutation } from "@/lib/hooks/mutations/useCreateTargetMutation";

interface TargetCardFormProps {
  currentTarget: Target | undefined | null;
  setIsCreating: (state: boolean) => void;
  subcategoryId: string;
  currencyToDisplay: string;
}

const TargetCardForm: FC<TargetCardFormProps> = ({
  currentTarget,
  setIsCreating,
  subcategoryId,
  currencyToDisplay,
}) => {
  const { budgetId: selectedBudget } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/",
  });
  const { month: searchMonth, year: searchYear } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/",
  });
  const { toast } = useToast();

  const isEditing = !!currentTarget;
  const defaultAmount = formatToDecimalString(
    currentTarget?.targetAmount.amount || 0,
  );
  const defaultMonth = currentTarget
    ? currentTarget.upToMonth.month.toString()
    : searchMonth;
  const defaultYear = currentTarget
    ? currentTarget.upToMonth.year.toString()
    : searchYear;

  const form = useForm<CreateTarget>({
    defaultValues: {
      amount: defaultAmount,
      month: defaultMonth,
      year: defaultYear,
    },
  });
  const { handleSubmit, control, watch } = form;
  const inputAmount = watch("amount");
  const inputMonth = watch("month");
  const inputYear = watch("year");

  const onMutationError = () => {
    setIsCreating(true);
    toast({
      title: "Error",
      variant: "destructive",
      description: "Oops... Something went wrong. Please try again later.",
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
              <div className="col-span-2 h-10 w-full rounded-md border border-input px-3 text-sm">
                <TargetCardFormDatePicker
                  searchMonth={searchMonth}
                  searchYear={searchYear}
                />
              </div>
            </FormControl>
          </FormItem>
          <div className="pt-6">
            <Button
              type="submit"
              disabled={
                (Number(inputAmount) === Number(defaultAmount) &&
                  inputMonth === defaultMonth &&
                  inputYear === defaultYear) ||
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
