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
  dateRangeStart?: string | null;
  dateRangeEnd?: string | null;
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

interface CreateTransactionsPayload {
  budgetId: string;
  accountId: string;
  transactions: Omit<CreateTransactionPayload, "accountId">[];
}

export interface SetSubcategoryPayload {
  budgetId: string;
  transactionId: string;
  subcategoryId: string;
}

export const getTransactions = async (
  budgetId: string,
  search: QueryParams,
) => {
  const {
    accountId,
    counterpartyId,
    subcategoryId,
    date,
    period,
    dateRangeEnd,
    dateRangeStart,
  } = search;

  const searchParams = new URLSearchParams();

  if (accountId) searchParams.append("accountId", accountId);
  if (counterpartyId) searchParams.append("counterpartyId", counterpartyId);
  if (subcategoryId) searchParams.append("subcategoryId", subcategoryId);

  if (period === "range") {
    if (dateRangeStart) searchParams.append("dateRangeStart", dateRangeStart);
    if (dateRangeEnd) searchParams.append("dateRangeEnd", dateRangeEnd);
  } else {
    if (date) searchParams.append("date", date);
    if (period) searchParams.append("period", period);
  }

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

export const createTransactions = ({
  budgetId,
  accountId,
  transactions,
}: CreateTransactionsPayload) =>
  budgetApi.post(`/${budgetId}/accounts/${accountId}/transactions/bulk`, {
    transactions,
  });

export const deleteTransaction = ({
  budgetId,
  transactionId,
}: TransactionBudget) =>
  budgetApi.delete(`/${budgetId}/transactions/${transactionId}`);

export const deleteMultipleTransactions = ({
  budgetId,
  rows,
}: DeleteMultipleTransactions) => {
  const idsToDelete = rows.map((t) => t.original.id);

  return budgetApi.delete(`/${budgetId}/transactions/bulk`, {
    data: {
      transactionsId: idsToDelete,
    },
  });
};

export const setSubcategory = ({
  budgetId,
  transactionId,
  subcategoryId,
}: SetSubcategoryPayload) =>
  budgetApi.put(`/${budgetId}/transactions/${transactionId}/subcategory`, {
    subcategoryId,
  });
