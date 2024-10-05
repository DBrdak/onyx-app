import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../api/category";

interface Props {
  budgetId: string;
}

interface Selectable {
  id: string;
  label: string;
  value: string;
}

export interface SelectableCategory extends Selectable {
  subcategories: Selectable[];
}

export const useSelectableCategories = ({
  budgetId,
}: Props): SelectableCategory[] | null => {
  const queryClient = useQueryClient();
  const queryKey = getCategoriesQueryOptions(budgetId).queryKey;

  return useMemo<SelectableCategory[] | null>(() => {
    const categories = queryClient.getQueryData(queryKey);
    if (!categories || !categories.length) return null;

    return categories
      .filter((c) => c.subcategories.length > 0 && c.name !== "Uncategorized")
      .map((c) => ({
        id: c.id,
        label: c.name,
        value: c.id,
        subcategories: c.subcategories.map((s) => ({
          id: s.id,
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
