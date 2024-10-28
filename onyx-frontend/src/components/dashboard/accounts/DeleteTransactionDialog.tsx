import { FC, useEffect, useState } from "react";

import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DialogFooterWithErrorHandle from "@/components/DialogFooterWithErrorHandle";

interface DeleteTransactionDialogProps {
  rowsToDeleteLength: number;
  isError: boolean;
  onDelete: () => void;
  error: Error | null;
  reset?: () => void;
}

const DeleteTransactionDialog: FC<DeleteTransactionDialogProps> = ({
  rowsToDeleteLength,
  isError,
  onDelete,
  error,
  reset,
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
        <DialogFooterWithErrorHandle
          error={error}
          isError={isError}
          onDelete={handleDelete}
          reset={reset}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
