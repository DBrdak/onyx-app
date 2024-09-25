import { budgetApi } from "@/lib/axios";
import {
  Transaction,
  TransactionResultSchema,
} from "@/lib/validation/transaction";
import { getErrorMessage } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";
import { Money } from "@/lib/validation/base";
import { Row } from "@tanstack/react-table";

interface TransactionBudget {
  budgetId: string;
  transactionId: string;
}
interface QueryParams {
  counterpartyId?: string;
  accountId?: string;
  subcategoryId?: string;
  date?: string;
  period?: string;
}

export interface CreateTransactionPayload {
  accountId: string;
  amount: Money;
  transactedAt: Date;
  counterpartyName: string;
  subcategoryId?: string | null;
}

export interface CreateTransaction {
  budgetId: string;
  payload: CreateTransactionPayload;
}

interface DeleteMultipleTransactions {
  budgetId: string;
  rows: Row<Transaction>[];
}

export const getTransactions = async (
  budgetId: string,
  search: QueryParams,
) => {
  const { accountId, counterpartyId, subcategoryId, date, period } = search;
  const searchParams = new URLSearchParams({
    ...(accountId && { accountId }),
    ...(counterpartyId && { counterpartyId }),
    ...(subcategoryId && { subcategoryId }),
    ...(date && { date }),
    ...(period && { period }),
  });

  let url = `/${budgetId}/transactions`;

  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  try {
    const { data } = await budgetApi.get(url);
    const validatedData = TransactionResultSchema.safeParse(data);
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

export const getTransactionsQueryKey = (accountId: string) => [
  "transactions",
  accountId,
];

export const getTransactionsQueryOptions = (
  budgetId: string,
  accountId: string,
  search: QueryParams,
) =>
  queryOptions({
    queryKey: ["transactions", accountId],
    queryFn: () => getTransactions(budgetId, search),
  });

export const createTransaction = ({ budgetId, payload }: CreateTransaction) =>
  budgetApi.post(`/${budgetId}/transactions`, payload);

export const deleteTransaction = ({
  budgetId,
  transactionId,
}: TransactionBudget) =>
  budgetApi.delete(`/${budgetId}/transactions/${transactionId}`);

export const deleteMultipleTransactions = ({
  budgetId,
  rows,
}: DeleteMultipleTransactions) => {
  const deletePromises = rows.map((r) =>
    deleteTransaction({ budgetId, transactionId: r.original.id }),
  );

  return Promise.all(deletePromises);
};
