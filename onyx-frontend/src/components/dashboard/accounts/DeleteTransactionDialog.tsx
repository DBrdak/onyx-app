import { FC, useEffect, useState } from "react";

import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteTransactionDialogProps {
  rowsToDeleteLength: number;
  isError: boolean;
  onDelete: () => void;
}

const DeleteTransactionDialog: FC<DeleteTransactionDialogProps> = ({
  rowsToDeleteLength,
  isError,
  onDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      setIsDeleteDialogOpen(true);
    }
  }, [isError]);

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash className="mr-2 size-4" />
          Delete ({rowsToDeleteLength.toString()})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all
            selected transactions.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center">
          {isError && (
            <p className="text-end text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          <Button type="submit" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
