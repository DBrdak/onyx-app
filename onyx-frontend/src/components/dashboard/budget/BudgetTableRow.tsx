import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Budget } from "@/lib/validation/budget";
import { deleteBudget, getBudgetsQueryOptions } from "@/lib/api/budget";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MONTH_STRING,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { User } from "@/lib/validation/user";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

interface BudgetTableRowProps {
  budget: Budget;
  user: User;
}

const BudgetTableRow: FC<BudgetTableRowProps> = ({ budget, user }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id } = budget;

  const { mutate, isError, isPending } = useMutation({
    mutationKey: ["deleteBudget", id],
    mutationFn: deleteBudget,
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: getBudgetsQueryOptions.queryKey,
      });
    },
    onError: () => {
      setIsDeleteDialogOpen(true);
    },
  });

  const onDelete = () => {
    mutate(id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <li
      className={cn("min-w-[600px] border-t", {
        "opacity-50": isPending || budget.optimistic,
      })}
    >
      <Link
        to="/budget/$budgetId"
        params={{ budgetId: budget.id }}
        search={{
          month: DEFAULT_MONTH_STRING,
          year: DEFAULT_YEAR_STRING,
          accMonth: DEFAULT_MONTH_STRING,
          accYear: DEFAULT_YEAR_STRING,
        }}
        mask={{ to: `/budget/${budget.id}` }}
        preload="intent"
        className="grid w-full grid-cols-9 gap-x-4 px-4 py-8 hover:bg-accent"
      >
        <p className="col-span-3 min-w-[150px]">{budget.name}</p>
        <p className="col-span-2 min-w-[100px]">{budget.currency}</p>
        <div className="col-span-4 grid min-w-[250px] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {budget.budgetMembers.map((member) => (
            <p
              key={id}
              className="truncate rounded-full border px-2 text-center"
            >
              {member.username === user?.username ? "You" : member.username}
            </p>
          ))}
        </div>
      </Link>
      <Button size="icon">
        <Ellipsis />
      </Button>
    </li>
  );
};

export default BudgetTableRow;
