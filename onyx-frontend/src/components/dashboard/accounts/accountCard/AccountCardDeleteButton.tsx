import { FC, useState } from "react";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteAccountMutation } from "@/lib/hooks/mutations/useDeleteAccountMutation";
import { useBudgetId } from "@/store/dashboard/budgetStore";

interface AccountCardDeleteButtonProps {
  accountId: string;
  disabled: boolean;
}

const AccountCardDeleteButton: FC<AccountCardDeleteButtonProps> = ({
  accountId,
  disabled,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const budgetId = useBudgetId();

  const onMutationSuccess = () => {
    setIsDeleteDialogOpen(false);
  };

  const { mutate, isError, isPending } = useDeleteAccountMutation({
    budgetId,
    onMutationSuccess,
  });

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
        <DialogFooter className="items-center">
          {isError && (
            <p className="text-end text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          <LoadingButton
            type="submit"
            variant="destructive"
            onClick={onDelete}
            isLoading={isPending}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCardDeleteButton;
