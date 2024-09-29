import { FC } from "react";

import { Plus } from "lucide-react";
import CalendarInput from "@/components/dashboard/CalendarInput";
import PlusMinusButton from "@/components/dashboard/PlusMinusButton";
import AmountInput from "@/components/dashboard/AmountInput";
import SubcategoriesPopover from "@/components/dashboard/accounts/SubcategoriesPopover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Account } from "@/lib/validation/account";
import { useCreateTransactionForm } from "@/lib/hooks/useCreateTransactionForm";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import CurrencyCombobox from "../../CurrencyCombobox";

interface TransactionsTableCreateFormProps {
  account: Account;
}

const TransactionsTableCreateForm: FC<TransactionsTableCreateFormProps> = ({
  account,
}) => {
  const {
    handlePlusMinusBtn,
    form,
    handleSubmit,
    onSubmit,
    control,
    transactionSign,
    selectedCurrency,
    isCurrentMonthSelected,
    isPending,
    selectedSubcategoryName,
    accMonth,
    accYear,
    clearErrors,
    budgetId,
    onSubcategoryChange,
  } = useCreateTransactionForm({ account });

  const formRef = useClickOutside<HTMLFormElement>(() => clearErrors());

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-table-layout gap-x-6 py-1.5"
        ref={formRef}
      >
        <Button size="icon" type="submit" disabled={isPending}>
          <Plus />
        </Button>
        <FormField
          control={form.control}
          name="transactedAt"
          render={({ field }) => (
            <FormItem className="w-full pl-1.5">
              <CalendarInput
                field={field}
                isCurrentMonthSelected={isCurrentMonthSelected}
                accMonth={Number(accMonth)}
                accYear={Number(accYear)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="counterpartyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Counterparty..."
                  className="bg-transparent placeholder:text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="subcategoryId"
          render={() => (
            <FormItem>
              <SubcategoriesPopover
                budgetId={budgetId}
                onChange={onSubcategoryChange}
                selectedSubcategoryName={selectedSubcategoryName}
                disabled={transactionSign === "+"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="mr-3">
                <CurrencyCombobox
                  selectedValue={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <PlusMinusButton
                      state={transactionSign}
                      setState={handlePlusMinusBtn}
                    />
                    <div className="px-1.5">
                      <AmountInput
                        field={field}
                        currency={selectedCurrency || account.balance.currency}
                        className="border text-right"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="w-full pr-1.5 text-right" />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default TransactionsTableCreateForm;
