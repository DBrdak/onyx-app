import { queryOptions } from "@tanstack/react-query";

import { budgetApi } from "@/lib/axios";
import { validateResponse } from "@/lib/utils";
import { Category, CategoryResultSchema } from "@/lib/validation/category";
import { queryBudgetKeys } from "./queryKeys";

export interface CreateCategoryProps {
  budgetId: string;
  name: string;
}

export const getCategories = async (budgetId: string) => {
  const { data } = await budgetApi.get(`/${budgetId}/categories`);
  return validateResponse<Category[]>(CategoryResultSchema, data);
};

export const getCategoriesQueryOptions = (budgetId: string) =>
  queryOptions({
    queryKey: queryBudgetKeys.categories(budgetId),
    queryFn: () => getCategories(budgetId),
  });

export const createCategory = async ({ budgetId, name }: CreateCategoryProps) =>
  budgetApi.post(`/${budgetId}/categories`, { name });

export const deleteCategory = ({
  budgetId,
  categoryId,
}: {
  budgetId: string;
  categoryId: string;
}) => budgetApi.delete(`/${budgetId}/categories/${categoryId}`);

export const editCategoryName = ({
  budgetId,
  categoryId,
  newName,
}: {
  budgetId: string;
  categoryId: string;
  newName: string;
}) => budgetApi.put(`${budgetId}/categories/${categoryId}`, { newName });
