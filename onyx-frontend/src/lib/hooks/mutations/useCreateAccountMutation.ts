import { createAccount, getAccountsQueryOptions } from "@/lib/api/account";
import { useBudgetId, useBudgetSlug } from "@/store/dashboard/budgetStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface CreateAccountMutationProps {
  onMutationSuccess: () => void;
  onMutationError: (err: Error) => void;
}

export const useCreateAccountMutation = ({
  onMutationSuccess,
  onMutationError,
}: CreateAccountMutationProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const budgetSlug = useBudgetSlug();
  const budgetId = useBudgetId();

  return useMutation({
    mutationKey: ["createAccount"],
    mutationFn: createAccount,
    onError: (err) => {
      console.error("Mutation error:", err);
      onMutationError(err);
    },
    onSuccess: async ({ slug }) => {
      const queryKey = getAccountsQueryOptions(budgetId).queryKey;
      await queryClient.fetchQuery({ queryKey });
      onMutationSuccess();
      await navigate({
        to: "/budget/$budgetSlug/accounts/$accountSlug",
        params: { budgetSlug, accountSlug: slug },
      });
    },
  });
};
