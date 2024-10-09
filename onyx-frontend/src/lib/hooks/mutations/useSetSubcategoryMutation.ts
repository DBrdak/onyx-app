import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactionsQueryKey,
  setSubcategory,
  type SetSubcategoryPayload,
} from "@/lib/api/transaction";
import { Transaction } from "@/lib/validation/transaction";
import { getCategoriesQueryOptions } from "@/lib/api/category";

interface Props {
  accountId: string;
}

export const useSetSubcategoryMutation = ({ accountId }: Props) => {
  const queryClient = useQueryClient();
  const transactionsQueryKey = getTransactionsQueryKey(accountId);

  return useMutation({
    mutationKey: ["setSubcategory"],
    mutationFn: (payload: SetSubcategoryPayload) => setSubcategory(payload),

    onMutate: async (payload) => {
      const { transactionId, budgetId, subcategoryId } = payload;
      await queryClient.cancelQueries({ queryKey: transactionsQueryKey });

      const previousTransactions =
        queryClient.getQueryData<Transaction[]>(transactionsQueryKey);
      const categories = queryClient.getQueryData(
        getCategoriesQueryOptions(budgetId).queryKey,
      );

      const category = categories?.find((c) =>
        c.subcategories.some((s) => s.id === subcategoryId),
      );
      const subcategory = category?.subcategories.find(
        (s) => s.id === subcategoryId,
      );

      if (!subcategory) {
        console.warn("Subcategory not found");
        return { previousTransactions };
      }

      queryClient.setQueryData<Transaction[]>(
        transactionsQueryKey,
        (oldTransactions) => {
          if (!oldTransactions) return oldTransactions;

          return oldTransactions.map((transaction) => {
            if (transaction.id === transactionId) {
              return {
                ...transaction,
                subcategory: {
                  ...subcategory,
                },
              };
            }
            return transaction;
          });
        },
      );

      return { previousTransactions };
    },

    onError: (err, _payload, context) => {
      console.error("Error setting subcategory:", err);
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          transactionsQueryKey,
          context.previousTransactions,
        );
      }
    },

    onSettled: async (_data, _error, payload) => {
      const { budgetId } = payload;
      await queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
      await queryClient.invalidateQueries(getCategoriesQueryOptions(budgetId));
    },
  });
};
