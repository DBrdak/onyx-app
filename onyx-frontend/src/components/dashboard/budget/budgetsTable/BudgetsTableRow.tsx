import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutationState } from "@tanstack/react-query";

import { Ellipsis } from "lucide-react";
import BudgetsTableUserBadge from "@/components/dashboard/budget/budgetsTable/BudgetsTableUserBadge";
import BudgetsTableDeleteDialogContent from "@/components/dashboard/budget/budgetsTable/BudgetsTableDeleteDialogContent";
import BudgetsTableManageDialogContent from "@/components/dashboard/budget/budgetsTable/BudgetsTableManageDialogContent";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  DEFAULT_MONTH_STRING,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { cn } from "@/lib/utils";
import { type Budget } from "@/lib/validation/budget";
import { type User } from "@/lib/validation/user";

interface BudgetsTableRowProps {
  budget: Budget;
  user: User | undefined;
}

export enum OPTION {
  manage = "MANAGE",
  delete = "DELETE",
  none = "NONE",
}

const BudgetsTableRow: FC<BudgetsTableRowProps> = ({ budget, user }) => {
  const { id, name, currency, budgetMembers, optimistic } = budget;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [option, setOption] = useState(OPTION.none);

  const isDeleting = useMutationState({
    filters: { mutationKey: ["deleteBudget", id], status: "pending" },
    select: (mutation) => mutation.state.status,
  });

  const isEditingName = useMutationState({
    filters: { mutationKey: ["editName", id], status: "pending" },
    select: (mutation) => mutation.state.status,
  });

  const isPending =
    isDeleting[0] === "pending" || isEditingName[0] === "pending";

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
        <div className="col-span-3 min-w-[150px]">{name}</div>
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={!!optimistic || isPending}
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{budget.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="p-0"
                onClick={() => setOption(OPTION.manage)}
              >
                <DialogTrigger className="p-2">Manage</DialogTrigger>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="p-0"
                onClick={() => setOption(OPTION.delete)}
              >
                <DialogTrigger className="p-2">Delete</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {option === OPTION.delete && (
            <BudgetsTableDeleteDialogContent
              budget={budget}
              setDialogOpen={setIsDialogOpen}
            />
          )}
          {option === OPTION.manage && (
            <BudgetsTableManageDialogContent budget={budget} />
          )}
        </Dialog>
      </div>
    </li>
  );
};

export default BudgetsTableRow;
