import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory, getCategoriesQueryOptions } from "@/lib/api/category";
import { capitalize } from "@/lib/utils";

interface CategoryMutationProps {
  budgetId: string;
  onMutationError: (err: Error) => void;
  onMutationSuccess: () => void;
}

export const useCreateCategoryMutation = ({
  budgetId,
  onMutationError,
  onMutationSuccess,
}: CategoryMutationProps) => {
  const queryClient = useQueryClient();
  const queryKey = getCategoriesQueryOptions(budgetId).queryKey;

  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: createCategory,
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousCategories = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return [
          ...old,
          {
            id: "12345",
            name: capitalize(newCategory.name),
            subcategories: [],
            optimistic: true,
          },
        ];
      });

      return previousCategories;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (err, _newTodo, context) => {
      console.error("create category error", err);
      queryClient.setQueryData(queryKey, context);
      onMutationError(err);
    },
    onSuccess: () => {
      onMutationSuccess();
    },
  });
};
