import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CurrencyCombobox from "@/components/dashboard/CurrencyCombobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { CreateBudget, CreateBudgetSchema } from "@/lib/validation/budget";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/validation/user";
import { useCreateBudgetMutation } from "@/lib/hooks/mutations/useCreateBudgetMutation";
import { Badge } from "@/components/ui/badge";
import LoadingButton from "@/components/LoadingButton";

interface CreateBudgetFormProps {
  setIsCreating: (state: boolean) => void;
  user: User;
}

const CreateBudgetForm: FC<CreateBudgetFormProps> = ({
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

  const onMutationError = () => {
    setError("name", {
      type: "network",
      message: "Something went wrong. Please try again.",
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
                  className="h-14 w-full"
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
                className="h-14"
              />
            </FormItem>
          )}
        />
        <div className="flex h-14 items-center justify-center md:col-span-3">
          <Badge
            variant="outline"
            className="w-1/2 items-center justify-center text-lg font-medium"
          >
            You
          </Badge>
        </div>
        <LoadingButton
          type="submit"
          isLoading={isPending}
          disabled={isPending}
          className="col-span-2 h-14 rounded-l-none font-semibold"
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
};

export default CreateBudgetForm;
