import { FC, useState } from "react";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteAccountMutation } from "@/lib/hooks/mutations/useDeleteAccountMutation";
import DialogFooterWithErrorHandle from "@/components/DialogFooterWithErrorHandle";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateDependencies } from "@/lib/api/queryKeys";

interface AccountCardDeleteButtonProps {
  accountId: string;
  disabled: boolean;
}

const AccountCardDeleteButton: FC<AccountCardDeleteButtonProps> = ({
  accountId,
  disabled,
}) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const budgetId = useBudgetStore.use.budgetId();

  const onMutationSuccess = () => {
    invalidateDependencies(queryClient, "accounts", { budgetId }, true);
    setIsDeleteDialogOpen(false);
  };

  const { mutate, isError, isPending, error, reset } = useDeleteAccountMutation(
    {
      budgetId,
      onMutationSuccess,
    },
  );

  const onDelete = () => {
    mutate({ accountId, budgetId });
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="ghost"
          size="icon"
          className="opacity-50 hover:bg-transparent hover:text-primary-foreground hover:opacity-100"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            account and remove all data connected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooterWithErrorHandle
          error={error}
          isError={isError}
          onDelete={onDelete}
          isLoading={isPending}
          reset={reset}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccountCardDeleteButton;
