import { FC, ReactNode } from "react";

import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";

interface BudgetsTableUserBadgeProps {
  memberName: string;
  userName?: string;
  children?: ReactNode;
}

const BudgetsTableUserBadge: FC<BudgetsTableUserBadgeProps> = ({
  memberName,
  userName,
  children,
}) => {
  return (
    <Badge className="max-w-min items-center p-0" variant="outline">
      <UserAvatar username={memberName} />
      <span className="flex-1 px-4 text-center text-base font-normal">
        {memberName === userName ? "You" : memberName}
      </span>
      {children}
    </Badge>
  );
};

export default BudgetsTableUserBadge;
