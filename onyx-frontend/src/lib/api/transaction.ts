import { budgetApi } from "@/lib/axios";
import {
  Transaction,
  TransactionResultSchema,
} from "@/lib/validation/transaction";
import { getErrorMessage } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";
import { Money } from "@/lib/validation/base";
import { Row } from "@tanstack/react-table";
import { formatDateToValidString } from "../dates";
import { queryBudgetKeys } from "./queryKeys";

interface TransactionBudget {
  budgetId: string;
  transactionId: string;
}
interface QueryParams {
  counterpartyId?: string;
  accountId?: string;
  subcategoryId?: string;
  dateRangeStart: Date;
  dateRangeEnd: Date;
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
    dateRangeEnd,
    dateRangeStart,
  } = search;

  const searchParams = new URLSearchParams();
  const dateRangeStartString = formatDateToValidString(dateRangeStart);
  const dateRangeEndString = formatDateToValidString(dateRangeEnd);

  const customEncode = (param: string) => {
    if (param.includes("T")) {
      return param.replace(/\+/g, "%2B");
    }
    return encodeURIComponent(param);
  };

  if (accountId) searchParams.append("accountId", customEncode(accountId));
  if (counterpartyId)
    searchParams.append("counterpartyId", customEncode(counterpartyId));
  if (subcategoryId)
    searchParams.append("subcategoryId", customEncode(subcategoryId));

  if (dateRangeStartString)
    searchParams.append("dateRangeStart", customEncode(dateRangeStartString));
  if (dateRangeEndString)
    searchParams.append("dateRangeEnd", customEncode(dateRangeEndString));

  let url = `/${budgetId}/transactions`;

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
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
    console.error(error);
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
    queryKey: queryBudgetKeys.transactions(accountId),
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
