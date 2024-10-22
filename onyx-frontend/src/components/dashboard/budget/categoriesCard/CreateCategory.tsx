import { FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import {
  type CreateCategory,
  CreateCategorySchema,
} from "@/lib/validation/category";
import { useCreateCategoryMutation } from "@/lib/hooks/mutations/useCreateCategoryMutation";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import { getErrorMessage } from "@/lib/utils";

interface Props {
  categoriesCount: number;
}

const CreateCategory: FC<Props> = ({ categoriesCount }) => {
  const budgetId = useBudgetId();
  const form = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
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

  const onMutationError = (err: Error) => {
    const message = getErrorMessage(err);
    setError("name", {
      message,
    });
  };

  const onMutationSuccess = () => {
    reset();
  };

  const { mutate } = useCreateCategoryMutation({
    budgetId,
    onMutationError,
    onMutationSuccess,
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (categoriesCount >= 10) return;
    const { name } = data;
    mutate({ name, budgetId: budgetId });
  };

  const formRef = useClickOutside<HTMLFormElement>(() => {
    if (errors) {
      clearErrors();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <FormField
          control={control}
          disabled={categoriesCount >= 10}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex">
                  <input
                    placeholder="Add category..."
                    {...field}
                    className="h-14 w-full rounded-l-md border-y border-l px-6 font-normal outline-none"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-14 rounded-l-none"
                    disabled={categoriesCount >= 10}
                  >
                    <Plus className="size-5" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CreateCategory;
