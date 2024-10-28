import { FC, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  CreateCategorySchema,
  type CreateCategory,
} from "@/lib/validation/category";
import {
  editCategoryName,
  getCategoriesQueryOptions,
} from "@/lib/api/category";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cn, getErrorMessage } from "@/lib/utils";
import { type SelectCategorySectionProps } from "@/components/dashboard/budget/categoriesCard/selectCategory/SelectCategory";
import { useBudgetId } from "@/store/dashboard/budgetStore";

const SelectCategoryMiddle: FC<SelectCategorySectionProps> = ({
  isEdit,
  isSelected,
  category,
  setIsEdit,
}) => {
  const budgetId = useBudgetId();
  const form = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: category.name,
    },
  });
  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
    setError,
  } = form;
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const { mutate, isPending, variables } = useMutation({
    mutationKey: ["editCategory", category.id],
    mutationFn: editCategoryName,
    onError: (err) => {
      const message = getErrorMessage(err);
      setError("name", {
        message,
      });
    },
    onSettled: async (_newName, error) => {
      if (!error) {
        setIsEdit(false);
      }
      return queryClient.invalidateQueries({
        queryKey: getCategoriesQueryOptions(budgetId).queryKey,
      });
    },
  });

  const onSubmit: SubmitHandler<CreateCategory> = (data) => {
    mutate({
      budgetId,
      categoryId: category.id,
      newName: data.name,
    });
  };

  const formRef = useClickOutside<HTMLFormElement>(() => {
    if (errors) {
      clearErrors();
    }
  });

  if (isEdit)
    return (
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
          className="flex w-full items-center"
        >
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full space-y-1">
                <FormControl>
                  <input
                    placeholder="Add category..."
                    {...field}
                    ref={inputRef}
                    className="h-7 w-full bg-transparent outline-none"
                  />
                </FormControl>
                <FormMessage className="max-w-fit rounded-md bg-destructive px-2 text-primary-foreground" />
              </FormItem>
            )}
          />
          <Button type="submit">
            <Check />
          </Button>
        </form>
      </Form>
    );

  return (
    <p
      className={cn(
        "w-full translate-x-0 truncate pr-6 capitalize transition-transform duration-300 ease-in-out",
        isSelected && "max-w-64 translate-x-6",
        isPending && "opacity-50",
      )}
    >
      {isPending ? variables.newName : category.name}
    </p>
  );
};

export default SelectCategoryMiddle;
