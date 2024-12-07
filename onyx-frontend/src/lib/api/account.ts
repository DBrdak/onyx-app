import { queryOptions } from "@tanstack/react-query";
import { budgetApi } from "@/lib/axios";
import { validateResponse } from "@/lib/utils";
import {
  Account,
  AccountResultSchema,
  SingleAccountResultSchema,
} from "@/lib/validation/account";
import { AccountType, Money } from "@/lib/validation/base";
import { queryBudgetKeys } from "./queryKeys";

export interface CreateAccountPayload {
  name: string;
  balance: Money;
  accountType: AccountType;
}

export interface CreateAccount {
  budgetId: string;
  payload: CreateAccountPayload;
}

interface EditBase {
  budgetId: string;
  accountId: string;
}
export interface EditBalance extends EditBase {
  newBalance: Money;
}

interface EditAccountName extends EditBase {
  newName: string;
}

export const getAccounts = async (budgetId: string) => {
  const { data } = await budgetApi.get(`/${budgetId}/accounts`);

  return validateResponse<Account[]>(AccountResultSchema, data);
};

export const getAccountsQueryOptions = (budgetId: string) =>
  queryOptions({
    queryKey: queryBudgetKeys.accounts(budgetId),
    queryFn: () => getAccounts(budgetId),
  });

export const createAccount = async ({ budgetId, payload }: CreateAccount) => {
  const { data } = await budgetApi.post(`/${budgetId}/accounts`, payload);
  return validateResponse<Account>(SingleAccountResultSchema, data);
};

export const editBalance = ({ budgetId, newBalance, accountId }: EditBalance) =>
  budgetApi.put(`/${budgetId}/accounts/${accountId}`, { newBalance });

export const editAccountName = async ({
  budgetId,
  newName,
  accountId,
}: EditAccountName) => {
  const { data } = await budgetApi.put(`/${budgetId}/accounts/${accountId}`, {
    newName,
  });
  return validateResponse<Account>(SingleAccountResultSchema, data);
};

export const deleteAccount = ({ budgetId, accountId }: EditBase) =>
  budgetApi.delete(`/${budgetId}/accounts/${accountId}`);
