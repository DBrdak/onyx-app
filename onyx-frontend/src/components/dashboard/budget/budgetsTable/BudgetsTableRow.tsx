import { FC } from "react";
import { Link } from "@tanstack/react-router";

import BudgetsTableUserBadge from "./BudgetsTableUserBadge";
import BudgetsTableDropdown from "@/components/dashboard/budget/budgetsTable/BudgetsTableDropdown";

import {
  DEFAULT_MONTH_STRING,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { cn } from "@/lib/utils";
import { type Budget } from "@/lib/validation/budget";
import { type User } from "@/lib/validation/user";
import { useMutationState } from "@tanstack/react-query";

interface BudgetsTableRowProps {
  budget: Budget;
  user: User | undefined;
}

const BudgetsTableRow: FC<BudgetsTableRowProps> = ({ budget, user }) => {
  const { id, name, currency, budgetMembers, optimistic } = budget;

  const isDeleting = useMutationState({
    filters: { mutationKey: ["deleteBudget", id], status: "pending" },
    select: (mutation) => mutation.state.status,
  });

  const isPending = isDeleting[0] === "pending";

  return (
    <li
      className={cn(
        "grid w-full grid-cols-10 items-center",
        (optimistic || isPending) && "opacity-60",
      )}
    >
      <Link
        disabled={!!optimistic || isPending}
        to={`/budget/${id}`}
        params={{ budgetId: id }}
        search={{
          month: DEFAULT_MONTH_STRING,
          year: DEFAULT_YEAR_STRING,
          accMonth: DEFAULT_MONTH_STRING,
          accYear: DEFAULT_YEAR_STRING,
        }}
        mask={{ to: `/budget/${id}` }}
        className="group peer col-span-9 grid w-full grid-cols-9 items-center gap-x-4 px-4 py-8 hover:bg-accent"
      >
        <p className="col-span-3 min-w-[150px]">{name}</p>
        <p className="col-span-2 min-w-[100px]">{currency}</p>
        <div className="col-span-4 grid min-w-[250px] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {budgetMembers.map((member) => (
            <BudgetsTableUserBadge
              key={member.id}
              memberName={member.username}
              userName={user?.username}
            />
          ))}
        </div>
      </Link>
      <div className="col-span-1 flex h-full min-w-[50px] items-center justify-center peer-hover:bg-accent">
        <BudgetsTableDropdown
          budget={budget}
          disabled={!!optimistic || isPending}
        />
      </div>
    </li>
  );
};

export default BudgetsTableRow;
