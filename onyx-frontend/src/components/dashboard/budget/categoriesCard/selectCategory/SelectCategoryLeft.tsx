import { FC, useState } from "react";

import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type SelectCategorySectionProps } from "@/components/dashboard/budget/categoriesCard/selectCategory/SelectCategory";
import { useDeleteCategoryMutation } from "@/lib/hooks/mutations/useDeleteCategoryMutation";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import DialogFooterWithErrorHandle from "@/components/DialogFooterWithErrorHandle";

const SelectCategoryLeft: FC<SelectCategorySectionProps> = ({
  category,
  isEdit,
  setIsEdit,
  isSelected,
  disabled,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const budgetId = useBudgetId();

  const onMutationError = () => {
    setIsDeleteDialogOpen(true);
  };

  const { mutate, isError, error, reset } = useDeleteCategoryMutation({
    budgetId,
    onMutationError,
  });

  const onDelete = () => {
    mutate({ budgetId, categoryId: category.id });
    setIsDeleteDialogOpen(false);
  };

  if (isEdit)
    return (
      <Button onClick={() => setIsEdit(false)}>
        <X />
      </Button>
    );

  if (!isEdit && isSelected)
    return (
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="outline-none disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
          >
            <Settings />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsEdit(true)}>
              Edit
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              category and remove all your assigments.
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

export default SelectCategoryLeft;
