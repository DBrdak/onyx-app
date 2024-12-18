import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CurrencyCombobox from "@/components/dashboard/CurrencyCombobox";
import BudgetsTableUserBadge from "@/components/dashboard/budgets/budgetsTable/BudgetsTableUserBadge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { useCreateBudgetMutation } from "@/lib/hooks/mutations/useCreateBudgetMutation";
import { CreateBudget, CreateBudgetSchema } from "@/lib/validation/budget";
import { type User } from "@/lib/validation/user";
import { getErrorMessage } from "@/lib/utils";

interface BudgetsTableCreateFormProps {
  setIsCreating: (state: boolean) => void;
  user: User;
}

const BudgetsTableCreateForm: FC<BudgetsTableCreateFormProps> = ({
  setIsCreating,
  user,
}) => {
  const form = useForm<CreateBudget>({
    resolver: zodResolver(CreateBudgetSchema),
    defaultValues: {
      name: "",
      currency: user.currency,
      userId: user.id,
    },
  });
  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
    reset,
    setError,
  } = form;

  const onMutationError = (error: Error) => {
    const message = getErrorMessage(error);
    setError("name", {
      message,
    });
  };

  const onMutationSuccess = () => {
    reset();
    setIsCreating(false);
  };

  const { mutate, isPending } = useCreateBudgetMutation({
    onMutationError,
    onMutationSuccess,
  });

  const onSubmit: SubmitHandler<CreateBudget> = (data) => {
    const { name: budgetName, currency: budgetCurrency, userId } = data;
    mutate({ budgetName, budgetCurrency, userId });
  };

  const formRef = useClickOutside<HTMLFormElement>(() => {
    if (errors) {
      clearErrors();
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className="grid w-full gap-x-4 gap-y-4 px-4 py-6 md:grid-cols-10 md:gap-y-0"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-3">
              <FormControl>
                <Input
                  placeholder="Name..."
                  {...field}
                  className="h-11 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <CurrencyCombobox
                selectedValue={field.value}
                onChange={field.onChange}
                className="h-11"
              />
            </FormItem>
          )}
        />
        <div className="flex h-11 items-center justify-center md:col-span-3">
          <BudgetsTableUserBadge userName={user.username} />
        </div>
        <LoadingButton
          type="submit"
          isLoading={isPending}
          disabled={isPending}
          className="col-span-2 h-11 rounded-full font-semibold"
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
};

export default BudgetsTableCreateForm;
