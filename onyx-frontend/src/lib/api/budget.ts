import { queryOptions } from "@tanstack/react-query";

import { budgetApi } from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { BudgetResultSchema } from "@/lib/validation/budget";
import { ToAssignSchema } from "../validation/subcategory";

interface GetToAssign {
  month: string;
  year: string;
  budgetId: string;
}

const getBudgets = async () => {
  try {
    const { data } = await budgetApi.get("/budgets");

    const validatedData = BudgetResultSchema.safeParse(data);

    if (!validatedData.success) {
      throw new Error("Invalid data type.");
    }

    const { value, isFailure, error } = validatedData.data;
    if (isFailure) {
      throw new Error(error.message);
    }

    return value;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBudgetsQueryOptions = queryOptions({
  queryKey: ["budgets"],
  queryFn: getBudgets,
});

export const createBudget = ({
  budgetName,
  budgetCurrency,
  userId,
}: {
  budgetName: string;
  budgetCurrency: string;
  userId: string;
}) => budgetApi.post("/budgets", { budgetName, budgetCurrency, userId });

export const deleteBudget = (id: string) => budgetApi.delete(`/budgets/${id}`);

export const editBudgetName = ({ id, name }: { id: string; name: string }) =>
  budgetApi.put(`/budgets/${id}/edit`, { newBudgetName: name });

export const getToAssign = async ({ month, year, budgetId }: GetToAssign) => {
  try {
    const { data } = await budgetApi.get(
      `/${budgetId}/subcategories/to-assign?month=${month}&year=${year}`,
    );
    const validatedData = ToAssignSchema.safeParse(data);
    if (!validatedData.success) {
      console.log(validatedData.error.flatten());
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

export const getToAssignQueryKey = (budgetId: string) => ["toAssign", budgetId];

export const getToAssignQueryOptions = ({
  month,
  year,
  budgetId,
}: GetToAssign) =>
  queryOptions({
    queryKey: ["toAssign", budgetId],
    queryFn: () => getToAssign({ month, year, budgetId }),
  });

export const getInvitationLink = async (budgetId: string) => {
  try {
    const response = await budgetApi.put(`/budgets/${budgetId}/invitation`);
    console.log(response.data);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};
