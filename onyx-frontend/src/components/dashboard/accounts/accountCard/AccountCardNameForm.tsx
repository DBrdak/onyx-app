import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
  EditAccountNameSchema,
  TEditAccountSchema,
} from "@/lib/validation/account";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { editAccountName, getAccountsQueryOptions } from "@/lib/api/account";
import { getErrorMessage } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { invalidateDependencies } from "@/lib/api/queryKeys";

interface AccountCardNameFormProps {
  defaultName: string;
  accountId: string;
  disabled: boolean;
}

const AccountCardNameForm: FC<AccountCardNameFormProps> = ({
  defaultName,
  accountId,
  disabled,
}) => {
  const queryClient = useQueryClient();
  const budgetId = useBudgetStore.use.budgetId();
  const budgetSlug = useBudgetStore.use.budgetSlug();
  const navigate = useNavigate();
  const form = useForm<TEditAccountSchema>({
    defaultValues: {
      name: defaultName,
    },
  });
  const { toast } = useToast();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
    setFocus,
  } = form;

  const { mutate, isError } = useMutation({
    mutationFn: editAccountName,
    onError: (error) => {
      console.error("Mutation error:", error);
      const description = getErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
      setTimeout(() => setFocus("name"), 0);
    },
    onSuccess: async (res) => {
      invalidateDependencies(queryClient, "accounts", { budgetId }, true);
      await queryClient.fetchQuery(getAccountsQueryOptions(budgetId));
      await navigate({
        to: "/budget/$budgetSlug/accounts/$accountSlug",
        params: {
          budgetSlug,
          accountSlug: res.slug,
        },
      });
    },
  });

  const onSubmit: SubmitHandler<TEditAccountSchema> = (data) => {
    const validatedData = EditAccountNameSchema.safeParse(data);

    if (validatedData.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid subcategory name.",
      });

      setTimeout(() => setFocus("name"), 0);
      return;
    }

    const { name: newName } = validatedData.data;

    if (newName === defaultName) return;

    mutate({ accountId, budgetId, newName });
  };

  useEffect(() => {
    if (isError) {
      reset({
        name: defaultName,
      });
    }
  }, [isError, reset]);

  useEffect(() => {
    reset({
      name: defaultName,
    });
  }, [defaultName, reset]);

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  disabled={disabled}
                  className="border-none bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-primary-foreground focus-visible:ring-offset-1 md:text-2xl"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AccountCardNameForm;
