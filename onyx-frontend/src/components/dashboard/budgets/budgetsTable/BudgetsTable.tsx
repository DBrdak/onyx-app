import { FC, useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import BudgetsTableRow from "@/components/dashboard/budgets/budgetsTable/BudgetsTableRow";
import BudgetsTableCreateForm from "@/components/dashboard/budgets/budgetsTable/BudgetsTableCreateForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { type Budget } from "@/lib/validation/budget";
import { type User } from "@/lib/validation/user";

interface BudgetsTableProps {
  budgets: Budget[];
  user: User | undefined;
}

const BudgetsTable: FC<BudgetsTableProps> = ({ budgets, user }) => {
  const [isCreating, setIsCreating] = useState(false);

  const noBudgets = budgets.length === 0 || !budgets;

  useEffect(() => {
    if (noBudgets) {
      setIsCreating(true);
    }
  }, [budgets, noBudgets]);

  const handleCreateBudgetButtonClick = () => {
    if (noBudgets) return;
    setIsCreating(!isCreating);
  };

  return (
    <ScrollArea className="h-full w-full min-w-[650px] pb-10 pr-4">
      <div className="sticky top-0 grid w-full grid-cols-10 gap-x-4 rounded-t-lg border-x border-t bg-muted p-4 font-semibold tracking-wide">
        <p className="col-span-3 min-w-[150px]">Name</p>
        <p className="col-span-2 min-w-[100px]">Currency</p>
        <p className="col-span-5 min-w-[250px]">Members</p>
      </div>
      <ul className="rounded-b-lg border">
        {budgets.map((budget) => (
          <BudgetsTableRow budget={budget} user={user} key={budget.id} />
        ))}
        {user && (
          <li
            className={cn(
              "grid grid-rows-[0fr] overflow-hidden transition-all duration-300 ease-in-out",
              isCreating && user && "grid-rows-[1fr] border-t",
            )}
          >
            <div className="overflow-hidden">
              <BudgetsTableCreateForm
                setIsCreating={setIsCreating}
                user={user}
              />
            </div>
          </li>
        )}
      </ul>
      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          className={cn("rounded-full", isCreating && "bg-secondary")}
          size="icon"
          onClick={handleCreateBudgetButtonClick}
          disabled={noBudgets}
        >
          {isCreating ? <Minus /> : <Plus />}
        </Button>
      </div>
    </ScrollArea>
  );
};

export default BudgetsTable;
