import { FC } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useParams, useSearch } from "@tanstack/react-router";

import AmountInput from "@/components/dashboard/AmountInput";
import { Form, FormField, FormItem } from "@/components/ui/form";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { FormAssignment, assign } from "@/lib/api/subcategory";
import useAmountForm from "@/lib/hooks/useAmountForm";
import { formatToDotDecimal } from "@/lib/utils";

interface SubcategoryAccordionAssignmentFormProps {
  defaultAmount: number | undefined;
  subcategoryId: string;
  currencyToDisplay: string;
}

const SubcategoryAccordionAssignmentForm: FC<
  SubcategoryAccordionAssignmentFormProps
> = ({ defaultAmount, subcategoryId, currencyToDisplay }) => {
  const { budgetId: selectedBudget } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/",
  });
  const { month, year } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/",
  });

  const { control, form, handleSubmit, isDirty, mutate } = useAmountForm({
    defaultAmount: defaultAmount || 0,
    mutationFn: assign,
    budgetId: selectedBudget,
    month,
    year,
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { amount } = data;
    const amountFormatted = formatToDotDecimal(amount);
    if (Number(amountFormatted) === Number(defaultAmount)) return;

    const assignment: FormAssignment = {
      assignedAmount: Number(amountFormatted),
      assignmentMonth: {
        month: Number(month),
        year: Number(year),
      },
    };
    mutate({ budgetId: selectedBudget, subcategoryId, assignment });
  };

  const formRef = useClickOutside<HTMLFormElement>(() => {
    if (isDirty) {
      handleSubmit(onSubmit)();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex items-center space-y-0">
              <AmountInput
                field={field}
                currency={currencyToDisplay}
                className="h-8 border-none bg-transparent px-1 text-right"
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SubcategoryAccordionAssignmentForm;
