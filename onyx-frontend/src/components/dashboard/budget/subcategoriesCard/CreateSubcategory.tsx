import { FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronRight, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  type CreateSubcategory,
  CreateSubcategorySchema,
} from "@/lib/validation/subcategory";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { useCreateSubcategoryMutation } from "@/lib/hooks/mutations/useCreateSubcategoryMutation";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import { getErrorMessage } from "@/lib/utils";

interface CreateSubcategoryProps {
  parentCategoryId: string;
}

const CreateSubcategory: FC<CreateSubcategoryProps> = ({
  parentCategoryId,
}) => {
  const budgetId = useBudgetId();
  const form = useForm<CreateSubcategory>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateSubcategorySchema),
  });
  const { handleSubmit, control, clearErrors, reset, setError } = form;

  const onMutationError = (err: Error) => {
    const message = getErrorMessage(err);
    setError("name", {
      message,
    });
  };

  const onMutationSuccess = () => {
    reset();
  };

  const { mutate } = useCreateSubcategoryMutation({
    budgetId,
    parentCategoryId,
    onMutationError,
    onMutationSuccess,
  });

  const onSubmit: SubmitHandler<CreateSubcategory> = (data) => {
    const { name: subcategoryName } = data;
    mutate({ budgetId, parentCategoryId, subcategoryName });
  };

  const formRef = useClickOutside<HTMLFormElement>(() => {
    clearErrors();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center px-1 py-2"
        ref={formRef}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full space-y-1">
              <div className="flex">
                <FormLabel className="flex w-10 items-center justify-center opacity-60">
                  <ChevronRight className="size-6" />
                </FormLabel>
                <FormControl>
                  <input
                    placeholder="Add subcategory..."
                    {...field}
                    className="mr-4 h-10 flex-1 rounded-md px-4 text-sm outline-none ring-secondary ring-offset-0 focus:ring-1"
                  />
                </FormControl>
                <Button type="submit" variant="ghost" size="icon">
                  <Plus />
                </Button>
              </div>
              <FormMessage className="ml-14" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CreateSubcategory;
