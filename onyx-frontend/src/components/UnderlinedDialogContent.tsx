import { FC, ReactNode } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface UnderlinedDialogContentProps {
  children: ReactNode;
  title: string;
  destructive?: boolean;
  className?: string;
}

const UnderlinedDialogContent: FC<UnderlinedDialogContentProps> = ({
  children,
  title,
  destructive,
  className,
}) => {
  return (
    <DialogContent
      className={cn("space-y-4", className)}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader
        className={cn(
          "border-b pb-4 pt-2",
          destructive ? "border-destructive" : "border-primary",
        )}
      >
        <DialogTitle className="text-center">{title}</DialogTitle>
      </DialogHeader>

      {children}
    </DialogContent>
  );
};

export default UnderlinedDialogContent;
