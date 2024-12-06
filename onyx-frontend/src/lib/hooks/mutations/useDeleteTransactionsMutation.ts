import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteMultipleTransactions,
  getTransactionsQueryKey,
} from "@/lib/api/transaction";
import { Transaction } from "@/lib/validation/transaction";
import { invalidateDependencies } from "@/lib/api/queryKeys";

interface Props {
  accountId: string;
  budgetId: string;
}

export const useDeleteTransactionsMutation = ({
  accountId,
  budgetId,
}: Props) => {
  const queryClient = useQueryClient();
  const transactionsQueryKey = getTransactionsQueryKey(accountId);

  return useMutation({
    mutationKey: ["deleteTransactions"],
    mutationFn: deleteMultipleTransactions,
    onMutate: (args) => {
      queryClient.cancelQueries({ queryKey: transactionsQueryKey });

      const previousTransactions =
        queryClient.getQueryData<Transaction[]>(transactionsQueryKey);

      queryClient.setQueryData<Transaction[]>(transactionsQueryKey, (old) => {
        if (!old || !Array.isArray(old)) return old;

        const idsToDelete = new Set(args.rows.map((r) => r.original.id));
        return old.filter((transaction) => !idsToDelete.has(transaction.id));
      });

      return previousTransactions;
    },
    onError: (err, _args, previousTransactions) => {
      console.log(err);
      if (previousTransactions) {
        queryClient.setQueryData(transactionsQueryKey, previousTransactions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
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
};
