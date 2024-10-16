import { FC, useState } from "react";

import { X } from "lucide-react";
import BudgetsTableUserBadge from "@/components/dashboard/budgets/budgetsTable/BudgetsTableUserBadge";

import { cn } from "@/lib/utils";
import { type BudgetMember } from "@/lib/validation/user";
import { Budget } from "@/lib/validation/budget";
import BudgetsTableRemoveForm from "./BudgetsTableRemoveForm";
import { useUser } from "@/store/auth/authStore";

interface BudgetsTableRemoveMembersProps {
  budget: Budget;
}

const BudgetsTableRemoveMembers: FC<BudgetsTableRemoveMembersProps> = ({
  budget,
}) => {
  const [selectedMember, setSelectedMember] = useState<BudgetMember | null>(
    null,
  );
  const user = useUser();

  const removeDisabled = budget.budgetMembers.length < 2;

  const handleSelect = (member: BudgetMember) => {
    if (removeDisabled) return;
    setSelectedMember((oldMember) =>
      oldMember?.id === member.id ? null : member,
    );
  };

  return (
    <div className={cn("space-y-4", removeDisabled && "opacity-50")}>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {budget.budgetMembers.map((member) => (
          <li
            className={cn(
              "w-fit cursor-pointer rounded-full",
              selectedMember?.id === member.id && "bg-destructive/60",
              !removeDisabled && "hover:bg-destructive/30",
              removeDisabled && "cursor-not-allowed",
            )}
            onClick={() => handleSelect(member)}
          >
            <BudgetsTableUserBadge
              key={member.id}
              userName={member.id === user?.id ? "You" : member.username}
              children={<X className="mr-2 size-4" />}
            />
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "grid grid-rows-[0fr] overflow-hidden transition-all duration-200 ease-in-out",
          selectedMember && "grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden text-sm">
          <p>
            {`You are trying to remove ${selectedMember?.username || ""}, email: ${selectedMember?.email || ""}. Please pass down member name to confirm this action.`}
          </p>

          <BudgetsTableRemoveForm
            budgetId={budget.id}
            member={selectedMember}
            setSelectedMember={setSelectedMember}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetsTableRemoveMembers;
