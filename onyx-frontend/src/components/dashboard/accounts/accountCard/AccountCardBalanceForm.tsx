import { FC } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import AmountInput from "@/components/dashboard/AmountInput";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Money } from "@/lib/validation/base";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { editBalance } from "@/lib/api/account";
import { useParams, useSearch } from "@tanstack/react-router";
import useAmountForm from "@/lib/hooks/useAmountForm";
import { formatToDotDecimal } from "@/lib/utils";

interface AccountCardBalanceFormProps {
  balance: Money;
  accountId: string;
  disabled: boolean;
}

const AccountCardBalanceForm: FC<AccountCardBalanceFormProps> = ({
  balance,
  accountId,
  disabled,
}) => {
  const { budgetId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { month, year } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { amount, currency } = balance;
  const { mutate, isDirty, handleSubmit, control, form } = useAmountForm({
    defaultAmount: amount,
    mutationFn: editBalance,
    budgetId,
    month,
    year,
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { amount } = data;
    const formattedAmount = formatToDotDecimal(amount);
    if (Number(formattedAmount) === amount) return;

    const newBalance: Money = {
      amount: Number(formattedAmount),
      currency,
    };

    mutate({ budgetId, newBalance, accountId });
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
            <FormItem className="flex items-center space-x-1 space-y-0">
              <AmountInput
                disabled={disabled}
                field={field}
                currency={currency}
                className="border-0 bg-transparent pl-1 text-left text-lg focus-visible:ring-0 focus-visible:ring-primary-foreground focus-visible:ring-offset-1 md:text-xl"
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AccountCardBalanceForm;
