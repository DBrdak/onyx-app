import { queryOptions } from "@tanstack/react-query";

import { budgetApi } from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { CategoryResultSchema } from "@/lib/validation/category";

export interface CreateCategoryProps {
  budgetId: string;
  name: string;
}

export const getCategories = async (budgetId: string) => {
  try {
    const { data } = await budgetApi.get(`/${budgetId}/categories`);
    const validatedData = CategoryResultSchema.safeParse(data);
    if (!validatedData.success) {
      console.log(validatedData.error?.issues);
      throw new Error("Invalid data type.");
    }

    const { value, isFailure, error } = validatedData.data;
    if (isFailure) {
      throw new Error(error.message);
    }

    return value;
  } catch (error) {
    console.error(getErrorMessage(error));
    throw new Error(getErrorMessage(error));
  }
};

export const getCategoriesQueryOptions = (budgetId: string) =>
  queryOptions({
    queryKey: ["categories", budgetId],
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
