import { FC } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BudgetsTableEditNameForm from "./BudgetsTableEditNameForm";
import { type Budget } from "@/lib/validation/budget";

interface BudgetsTableManageDialogContentProps {
  budget: Budget;
}

const BudgetsTableManageDialogContent: FC<
  BudgetsTableManageDialogContentProps
> = ({ budget }) => {
  return (
    <DialogContent
      className="space-y-4"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader className="border-b border-primary pb-4 pt-2">
        <DialogTitle className="text-center">Manage Budget</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <DialogTitle>Edit name</DialogTitle>
        <BudgetsTableEditNameForm budget={budget} />
      </div>
      <div>delete members</div>
      <div>invitation link</div>
    </DialogContent>
  );
};

export default BudgetsTableManageDialogContent;
