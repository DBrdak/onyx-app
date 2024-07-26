import { FC } from "react";

import { Plus } from "lucide-react";
import CurrencyCombobox from "@/components/dashboard/CurrencyCombobox";
import AmountInput from "@/components/dashboard/AmountInput";
import PlusMinusButton from "@/components/dashboard/PlusMinusButton";
import LoadingButton from "@/components/LoadingButton";
import CalendarInput from "@/components/dashboard/CalendarInput";
import SubcategoriesPopover from "@/components/dashboard/accounts/SubcategoriesPopover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Account } from "@/lib/validation/account";
import { useCreateTransactionForm } from "@/lib/hooks/useCreateTransactionForm";

interface TransactionTableCreateModalProps {
  account: Account;
}

const TransactionTableCreateModal: FC<TransactionTableCreateModalProps> = ({
  account,
}) => {
  const {
    handlePlusMinusBtn,
    onSubcategoryChange,
    form,
    handleSubmit,
    onSubmit,
    control,
    setFocus,
    transactionSign,
    selectedCurrency,
    isCurrentMonthSelected,
    isPending,
    selectedSubcategoryName,
    accMonth,
    accYear,
    budgetId,
  } = useCreateTransactionForm({ account });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-2">
          <Plus className="inline-flex size-5 flex-shrink-0" />
          <span className="inline-flex">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full w-full overflow-y-auto px-4 md:h-auto md:max-w-[400px] md:overflow-y-hidden">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="pt-10">
              <div className="space-y-4 px-1.5">
                <FormField
                  control={control}
                  name="counterpartyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Counterparty name:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency:</FormLabel>
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
                      <FormLabel onClick={() => setFocus("amount")}>
                        Amount:
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <PlusMinusButton
                            state={transactionSign}
                            setState={handlePlusMinusBtn}
                          />
                          <AmountInput
                            field={field}
                            currency={
                              selectedCurrency || account.balance.currency
                            }
                            className="border text-left"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        To set whether the amount is an income or an expense,
                        select the button.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transactedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Transacted at:</FormLabel>
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
              </div>
              <div
                className={cn(
                  "grid grid-rows-[1fr] transition-all duration-300",
                  transactionSign === "+" && "grid-rows-[0fr]",
                )}
              >
                <div className="mt-4 space-y-4 overflow-hidden px-1.5 pb-1.5">
                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={() => (
                      <FormItem>
                        <FormLabel>Subcategory:</FormLabel>
                        <SubcategoriesPopover
                          budgetId={budgetId}
                          onChange={onSubcategoryChange}
                          selectedSubcategoryName={selectedSubcategoryName}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="px-1.5 pt-6">
                <LoadingButton
                  isLoading={isPending}
                  className="w-full"
                  type="submit"
                >
                  Create
                </LoadingButton>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionTableCreateModal;
