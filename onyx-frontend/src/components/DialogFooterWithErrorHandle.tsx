import { FC, useEffect } from "react";
import { cn, getErrorMessage } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import LoadingButton from "./LoadingButton";

interface DialogFooterWithErrorHandleProps {
  isError: boolean;
  error: Error | null;
  onDelete: () => void;
  reset?: () => void;
  isLoading?: boolean;
}

const DialogFooterWithErrorHandle: FC<DialogFooterWithErrorHandleProps> = ({
  isError,
  error,
  onDelete,
  reset,
  isLoading,
}) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (reset && isError) {
      timeoutId = setTimeout(() => {
        if (error) {
          reset();
        }
      }, 4000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isError, reset]);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "grid grid-rows-[0fr] transition-all duration-200",
          isError && "grid-rows-[1fr] rounded-md bg-destructive p-1",
        )}
      >
        <p className="overflow-hidden text-center text-sm text-destructive-foreground">
          {getErrorMessage(error) || "Something went wrong. Please try again."}
        </p>
      </div>

      <div className="flex justify-end">
        {isLoading ? (
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            variant="destructive"
            onClick={onDelete}
          />
        ) : (
          <Button type="submit" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default DialogFooterWithErrorHandle;
