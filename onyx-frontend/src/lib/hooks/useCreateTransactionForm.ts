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
import { formatToDotDecimal, getErrorMessage } from "@/lib/utils";
import { type Account } from "@/lib/validation/account";
import {
  useAccountDateRangeEnd,
  useAccountDateRangeStart,
  useAccountStore,
} from "@/store/dashboard/accountStore";
import { useToast } from "@/components/ui/use-toast";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { invalidateDependencies } from "../api/queryKeys";

interface Props {
  account: Account;
}

export const useCreateTransactionForm = ({ account }: Props) => {
  const budgetId = useBudgetStore.use.budgetId();
  const accountId = useAccountStore.use.accountId();
  const queryClient = useQueryClient();
  const dateRangeEnd = useAccountDateRangeEnd();
  const dateRangeStart = useAccountDateRangeStart();
  const { toast } = useToast();

  const form = useForm<TCreateTransactionSchema>({
    defaultValues: {
      currency: account.balance.currency,
      amount: "0.00",
      counterpartyName: "",
      subcategoryId: "",
      subcategoryName: "",
      transactedAt: new Date(),
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
  const currentlySelectedDate = watch("transactedAt");

  useEffect(() => {
    reset((defaultValues) => ({
      ...defaultValues,
      currency: account.balance.currency,
      transactedAt: currentlySelectedDate,
    }));
  }, [reset, account.balance.currency]);

  const transtactionsQueryOptions = getTransactionsQueryOptions(
    budgetId,
    accountId,
    {
      accountId,
      dateRangeStart,
      dateRangeEnd,
    },
  );
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
      const description = getErrorMessage(err);
      toast({
        variant: "destructive",
        description,
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(transtactionsQueryOptions);
    },
    onSuccess: () => {
      invalidateDependencies(
        queryClient,
        "transactions",
        { budgetId, accountId },
        true,
      );
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
    reset({
      ...data,
      amount: "0.00",
      counterpartyName: "",
      subcategoryId: "",
      subcategoryName: "",
    });
  };

  const handlePlusMinusBtn = useCallback(
    (state: "+" | "-") => {
      setValue("transactionSign", state);
    },
    [setValue],
  );

  const onSubcategoryChange = (value: string, label: string) => {
    setValue("subcategoryId", value, { shouldValidate: true });
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
