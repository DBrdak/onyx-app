import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { deleteAccount, getAccountsQueryOptions } from "@/lib/api/account";
import { useAccountActions } from "@/store/dashboard/accountStore";

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
  const { reset } = useAccountActions();

  return useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await queryClient.fetchQuery({ queryKey });
      const accounts = queryClient.getQueryData(queryKey);
      onMutationSuccess();

      if (!accounts || accounts.length === 0) {
        reset();
        await navigate({
          to: `/budget/${budgetId}`,
        });
      } else {
        const lastAccountId = accounts[accounts.length - 1].id;
        await navigate({
          to: `/budget/${budgetId}/accounts/${lastAccountId}`,
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete account:", error);
    },
  });
};
