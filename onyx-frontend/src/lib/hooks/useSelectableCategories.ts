import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../api/category";

interface Props {
  budgetId: string;
}

export const useSelectableCategories = ({ budgetId }: Props) => {
  const queryClient = useQueryClient();
  const queryKey = getCategoriesQueryOptions(budgetId).queryKey;

  return useMemo(() => {
    const categories = queryClient.getQueryData(queryKey);
    if (!categories || !categories.length) return null;
    return categories
      .filter((c) => c.subcategories.length > 0)
      .map((c) => ({
        label: c.name,
        value: c.id,
        subcategories: c.subcategories.map((s) => ({
          label: s.name,
          value: s.id,
        })),
      }));
  }, [
    queryKey,
    queryClient,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    queryClient.getQueryState(queryKey)?.dataUpdatedAt,
  ]);
};
