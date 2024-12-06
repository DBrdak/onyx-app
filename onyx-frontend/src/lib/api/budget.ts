import { queryOptions } from "@tanstack/react-query";

import { budgetApi } from "@/lib/axios";
import { validateResponse } from "@/lib/utils";
import {
  Budget,
  BudgetInvitationLink,
  BudgetInvitationLinkResultSchema,
  BudgetResultSchema,
} from "@/lib/validation/budget";
import { ToAssignSchema } from "@/lib/validation/subcategory";
import { Money } from "@/lib/validation/base";
import { queryBudgetKeys } from "./queryKeys";

interface GetToAssign {
  month: string | number;
  year: string | number;
  budgetId: string;
}

const getBudgets = async () => {
  const { data } = await budgetApi.get("/budgets");
  return validateResponse<Budget[]>(BudgetResultSchema, data);
};

export const getBudgetsQueryOptions = queryOptions({
  queryKey: queryBudgetKeys.budget,
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

export const getInvitationLink = async (budgetId: string) => {
  const response = await budgetApi.put(`/budgets/${budgetId}/invitation`);
  return validateResponse<BudgetInvitationLink>(
    BudgetInvitationLinkResultSchema,
    response.data,
  );
};

export const joinBudget = (token: string) =>
  budgetApi.put(`budgets/join/${token}`);

export const getToAssign = async ({ month, year, budgetId }: GetToAssign) => {
  const { data } = await budgetApi.get(
    `/${budgetId}/subcategories/to-assign?month=${month}&year=${year}`,
  );
  return validateResponse<Money>(ToAssignSchema, data);
};

export const getToAssignQueryKey = (budgetId: string) => ["toAssign", budgetId];

export const getToAssignQueryOptions = ({
  month,
  year,
  budgetId,
}: GetToAssign) =>
  queryOptions({
    queryKey: queryBudgetKeys.toAssign(budgetId),
    queryFn: () => getToAssign({ month, year, budgetId }),
  });

export const removeBudgetMember = ({
  memberId,
  budgetId,
}: {
  memberId: string;
  budgetId: string;
}) => budgetApi.put(`/budgets/${budgetId}/remove/${memberId}`);
