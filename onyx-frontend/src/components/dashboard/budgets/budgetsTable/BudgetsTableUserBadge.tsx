import { FC, ReactNode } from "react";

import UserAvatar from "@/components/userDropdown/UserAvatar";
import { Badge } from "@/components/ui/badge";

interface BudgetsTableUserBadgeProps {
  userName: string;
  avatar?: string;
  children?: ReactNode;
}

const BudgetsTableUserBadge: FC<BudgetsTableUserBadgeProps> = ({
  userName,
  avatar,
  children,
}) => {
  return (
    <Badge className="max-w-min items-center p-0" variant="outline">
      <UserAvatar avatar={avatar} />
      <span className="flex-1 px-4 text-center text-base font-normal">
        {userName}
      </span>
      {children}
    </Badge>
  );
};

export default BudgetsTableUserBadge;
