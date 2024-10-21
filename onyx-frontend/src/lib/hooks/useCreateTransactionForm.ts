import { useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateTransactionSchema,
  TCreateTransactionSchema,
} from "@/lib/validation/transaction";
import {
  createTransaction,
  CreateTransactionPayload,
  getTransactionsQueryOptions,
} from "@/lib/api/transaction";
import { getAccountsQueryOptions } from "@/lib/api/account";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { formatToDotDecimal } from "@/lib/utils";
import { type Account } from "@/lib/validation/account";
import { useAccountDate, useAccountId } from "@/store/dashboard/accountStore";
import { useBudgetId } from "@/store/dashboard/budgetStore";

interface Props {
  account: Account;
}

export const useCreateTransactionForm = ({ account }: Props) => {
  const accDate = useAccountDate();
  const budgetId = useBudgetId();
  const accountId = useAccountId();
  const queryClient = useQueryClient();

  const form = useForm<TCreateTransactionSchema>({
    defaultValues: {
      currency: account.balance.currency,
      amount: "0.00",
      counterpartyName: "",
      subcategoryId: "",
      subcategoryName: "",
      transactedAt: new Date(accDate),
      transactionSign: "-",
    },
    resolver: zodResolver(CreateTransactionSchema),
  });
  const {
    control,
    setFocus,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
  } = form;
  const selectedCurrency = watch("currency");
  const transactionSign = watch("transactionSign");
  const selectedSubcategoryName = watch("subcategoryName");

  useEffect(() => {
    reset((defaultValues) => ({
      ...defaultValues,
      currency: account.balance.currency,
      transactedAt: new Date(accDate),
    }));
  }, [reset, account.balance.currency, accDate]);

  const [
    transtactionsQueryOptions,
    accountsQueryOptions,
    categoriesQueryOptions,
  ] = [
    getTransactionsQueryOptions(budgetId, accountId, {
      accountId,
    }),
    getAccountsQueryOptions(budgetId),
    getCategoriesQueryOptions(budgetId),
  ];
  const transactionsQueryKey = transtactionsQueryOptions.queryKey;

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onMutate: (payload) => {
      queryClient.cancelQueries(transtactionsQueryOptions);

      const previousTransactions =
        queryClient.getQueryData(transactionsQueryKey);

      queryClient.setQueryData(transactionsQueryKey, (old) => {
        if (!old || !Array.isArray(old)) return old;

        const {
          payload: { amount, counterpartyName, transactedAt },
        } = payload;

        return [
          {
            transactedAt: transactedAt,
            id: "12345",
            amount: {
              amount: amount.amount,
              currency: amount.currency,
            },
            counterparty: {
              id: "123456",
              name: counterpartyName,
              type: "Payee" as const,
            },
            subcategory: {
              id: "1234556",
              name: selectedSubcategoryName || "N/A",
              assignments: null,
              description: null,
              target: null,
            },
            account,
          },
          ...old,
        ];
      });

      return previousTransactions;
    },
    onError: (err, _newTodo, previousTransactions) => {
      console.error(err);
      queryClient.setQueryData(transactionsQueryKey, previousTransactions);
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries(transtactionsQueryOptions),
        queryClient.invalidateQueries(accountsQueryOptions),
        queryClient.invalidateQueries(categoriesQueryOptions),
      ]);
    },
  });

  const onSubmit: SubmitHandler<TCreateTransactionSchema> = (data) => {
    const {
      amount,
      counterpartyName,
      subcategoryId,
      transactedAt,
      currency,
      transactionSign,
    } = data;
    const formattedAmount =
      transactionSign === "-"
        ? Number(transactionSign + formatToDotDecimal(amount))
        : Number(formatToDotDecimal(amount));

    const payload: CreateTransactionPayload = {
      accountId,
      amount: {
        amount: formattedAmount,
        currency,
      },
      counterpartyName,
      subcategoryId: subcategoryId === "" ? null : subcategoryId,
      transactedAt,
    };

    mutate({ budgetId, payload });
    reset();
  };

  const handlePlusMinusBtn = useCallback(
    (state: "+" | "-") => {
      setValue("transactionSign", state);
    },
    [setValue],
  );

  const onSubcategoryChange = (value: string, label: string) => {
    setValue("subcategoryId", value);
    setValue("subcategoryName", label, { shouldValidate: true });
  };

  return {
    handlePlusMinusBtn,
    onSubcategoryChange,
    onSubmit,
    handleSubmit,
    setFocus,
    clearErrors,
    form,
    control,
    isPending,
    selectedCurrency,
    transactionSign,
    selectedSubcategoryName,
    budgetId,
  };
};
