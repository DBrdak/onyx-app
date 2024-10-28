import { FC } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BudgetsTableEditNameForm from "./BudgetsTableEditNameForm";
import { BudgetInvitationLink, type Budget } from "@/lib/validation/budget";
import CopyToClipboard from "../../CopyToClipboard";
import BudgetsTableRemoveMembers from "./BudgetsTableRemoveMembers";
import { convertSecondsToDaysHours } from "@/lib/dates";

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
        <BudgetsTableRemoveMembers budget={budget} />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <DialogTitle>Invite members</DialogTitle>
          <p className="text-sm">Copy and share your unique invitation link!</p>
        </div>
        <div className="pb-2">
          <CopyToClipboard
            textToCopy={invitationLink?.value}
            isLoading={isInvitationLinkLoading}
          />
          {invitationLink && (
            <p className="pt-1 text-right text-sm">
              Your link is valid for:{" "}
              {convertSecondsToDaysHours(invitationLink.validForSeconds)}
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default BudgetsTableManageDialogContent;
