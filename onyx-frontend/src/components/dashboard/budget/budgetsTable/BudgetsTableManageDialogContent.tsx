import { FC } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BudgetsTableEditNameForm from "./BudgetsTableEditNameForm";
import { BudgetInvitationLink, type Budget } from "@/lib/validation/budget";
import CopyToClipboard from "../../CopyToClipboard";

interface BudgetsTableManageDialogContentProps {
  budget: Budget;
  invitationLink: BudgetInvitationLink | undefined;
  isInvitationLinkLoading: boolean;
}

const BudgetsTableManageDialogContent: FC<
  BudgetsTableManageDialogContentProps
> = ({ budget, invitationLink, isInvitationLinkLoading }) => {
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
      <div className="space-y-4">
        <div className="space-y-1">
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription>
            Copy and share your unique invitation link!
          </DialogDescription>
        </div>
        <div className="pb-2">
          {isInvitationLinkLoading && (
            <div className="flex animate-pulse">
              <div className="h-10 w-10 border bg-primary/60" />
              <div className="w-full border-y border-r bg-primary/60" />
            </div>
          )}
          {invitationLink && (
            <CopyToClipboard textToCopy={invitationLink.value} />
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default BudgetsTableManageDialogContent;
