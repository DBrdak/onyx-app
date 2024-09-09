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
      <div className="space-y-4">
        <DialogTitle>Remove members</DialogTitle>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription>
            Copy and share your unique invitation link!
          </DialogDescription>
        </div>
        <div className="pb-2">
          <CopyToClipboard
            textToCopy={invitationLink?.value}
            isLoading={isInvitationLinkLoading}
          />
          {invitationLink && (
            <p className="pt-1 text-right text-sm">
              Your link is valid for: {invitationLink.validForSeconds}
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default BudgetsTableManageDialogContent;
