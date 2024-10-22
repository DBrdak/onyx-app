import { FC, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { NameInputSchema, type TNameInputSchema } from "@/lib/validation/base";
import { type Budget } from "@/lib/validation/budget";
import { editBudgetName, getBudgetsQueryOptions } from "@/lib/api/budget";
import { getErrorMessage } from "@/lib/utils";

interface BudgetsTableEditNameFormProps {
  budget: Budget;
}

const BudgetsTableEditNameForm: FC<BudgetsTableEditNameFormProps> = ({
  budget,
}) => {
  const { name: defaultName, id } = budget;
  const queryClient = useQueryClient();

  const form = useForm<TNameInputSchema>({
    defaultValues: {
      name: defaultName,
    },
    resolver: zodResolver(NameInputSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
    setError,
  } = form;

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isError } = useMutation({
    mutationKey: ["editName", id],
    mutationFn: editBudgetName,
    onSettled: async () => {
      await queryClient.invalidateQueries(getBudgetsQueryOptions);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      const message = getErrorMessage(error);
      setError("name", {
        message,
      });
    },
  });

  const onSubmit: SubmitHandler<TNameInputSchema> = (data) => {
    if (defaultName === data.name) return;

    mutate({ name: data.name, id });
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        onKeyDown={handleKeyDown}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem autoFocus={false}>
              <Input {...field} ref={inputRef} autoComplete="off" />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default BudgetsTableEditNameForm;
