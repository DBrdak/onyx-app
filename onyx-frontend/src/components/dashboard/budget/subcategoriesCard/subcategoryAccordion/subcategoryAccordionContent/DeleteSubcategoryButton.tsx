import { FC, useState } from "react";

import DialogFooterWithErrorHandle from "@/components/DialogFooterWithErrorHandle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteSubcategoryMutation } from "@/lib/hooks/mutations/useDeleteSubcategoryMutation";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

const DeleteSubcategoryButton: FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const budgetId = useBudgetStore.use.budgetId();
  const subcategoryId = useBudgetStore.use.subcategoryId();

  const onMutationError = () => {
    setIsDeleteDialogOpen(true);
  };

  const { mutate, isError, error, reset } = useDeleteSubcategoryMutation({
    budgetId,
    onMutationError,
  });

  const onDelete = () => {
    if (!subcategoryId) return;
    mutate({ budgetId, subcategoryId });
    setIsDeleteDialogOpen(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full opacity-50 hover:opacity-100"
          variant="outline"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            subcategory and remove all your assignments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooterWithErrorHandle
          error={error}
          isError={isError}
          onDelete={onDelete}
          reset={reset}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSubcategoryButton;
