import { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteSubcategoryMutation } from "@/lib/hooks/mutations/useDeleteSubcategoryMutation";
import {
  useSelectedBudgetId,
  useSelectedSubcategoryId,
} from "@/store/dashboard/budgetStore";
import { getErrorMessage } from "@/lib/utils";

const DeleteSubcategoryButton: FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const budgetId = useSelectedBudgetId();
  const subcategoryId = useSelectedSubcategoryId();

  const onMutationError = () => {
    setIsDeleteDialogOpen(true);
  };

  const { mutate, isError, error } = useDeleteSubcategoryMutation({
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
        <DialogFooter className="items-center">
          {isError && (
            <p className="text-end text-sm text-destructive">
              {getErrorMessage(error)}
            </p>
          )}
          <Button type="submit" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSubcategoryButton;
