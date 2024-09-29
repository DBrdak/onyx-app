import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useMutationState } from "@tanstack/react-query";

import { Ellipsis } from "lucide-react";
import BudgetsTableUserBadge from "@/components/dashboard/budgets/budgetsTable/BudgetsTableUserBadge";
import BudgetsTableDeleteDialogContent from "@/components/dashboard/budgets/budgetsTable/BudgetsTableDeleteDialogContent";
import BudgetsTableManageDialogContent from "@/components/dashboard/budgets/budgetsTable/BudgetsTableManageDialogContent";

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
  DEFAULT_ISO_DATE,
  DEFAULT_MONTH_STRING,
  DEFAULT_PERIOD_OPTION,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { cn } from "@/lib/utils";
import { type Budget } from "@/lib/validation/budget";
import { getInvitationLink } from "@/lib/api/budget";
import { useAuthContext } from "@/lib/hooks/useAuthContext";

interface BudgetsTableRowProps {
  budget: Budget;
}

enum OPTION {
  manage = "MANAGE",
  delete = "DELETE",
  none = "NONE",
}

const BudgetsTableRow: FC<BudgetsTableRowProps> = ({ budget }) => {
  const { id, name, currency, budgetMembers, optimistic } = budget;
  const {
    auth: { user },
  } = useAuthContext();
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

  const {
    data: invitationLink,
    mutate: performGetInvitationLink,
    isPending: isInvitationLinkLoading,
  } = useMutation({
    mutationKey: ["invitationLink", id],
    mutationFn: () => getInvitationLink(id),
  });

  const handleManageDropdownButton = () => {
    performGetInvitationLink();
    setOption(OPTION.manage);
  };

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
          accDate: DEFAULT_ISO_DATE,
          accPeriod: DEFAULT_PERIOD_OPTION,
          tableSize: "7",
        }}
        mask={{ to: `/budget/${id}` }}
        className="group peer col-span-9 grid w-full grid-cols-9 items-center gap-x-4 px-4 py-6 hover:bg-accent"
      >
        <div className="col-span-3 min-w-[150px]">{name}</div>
        <p className="col-span-2 min-w-[100px]">{currency}</p>
        <div className="col-span-4 grid min-w-[250px] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {budgetMembers.map((member) => (
            <BudgetsTableUserBadge
              key={member.id}
              userName={user?.id === member.id ? "You" : member.username}
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
                onClick={handleManageDropdownButton}
              >
                <DialogTrigger className="w-full p-2 text-start">
                  Manage
                </DialogTrigger>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="p-0"
                onClick={() => setOption(OPTION.delete)}
              >
                <DialogTrigger className="w-full p-2 text-start">
                  Delete
                </DialogTrigger>
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
            <BudgetsTableManageDialogContent
              budget={budget}
              invitationLink={invitationLink}
              isInvitationLinkLoading={isInvitationLinkLoading}
            />
          )}
        </Dialog>
      </div>
    </li>
  );
};

export default BudgetsTableRow;
