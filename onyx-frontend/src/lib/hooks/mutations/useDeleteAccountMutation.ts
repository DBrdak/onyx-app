import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { deleteAccount, getAccountsQueryOptions } from "@/lib/api/account";
import { useAccountStore } from "@/store/dashboard/accountStore";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

interface DeleteAccountMutationProps {
  budgetId: string;
  onMutationSuccess: () => void;
}

export const useDeleteAccountMutation = ({
  budgetId,
  onMutationSuccess,
}: DeleteAccountMutationProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = getAccountsQueryOptions(budgetId).queryKey;
  const reset = useAccountStore.use.reset();
  const budgetSlug = useBudgetStore.use.budgetSlug();

  return useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      const accounts = queryClient.getQueryData(queryKey);
      onMutationSuccess();

      if (!accounts || accounts.length === 0) {
        reset();
        await navigate({
          to: "/budget/$budgetSlug",
          params: { budgetSlug },
        });
      } else {
        const accountSlug = accounts[0].slug;
        await navigate({
          to: "/budget/$budgetSlug/accounts/$accountSlug",
          params: { budgetSlug, accountSlug },
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete account:", error);
    },
  });
};
