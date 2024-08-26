import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { Ellipsis, Minus, Plus } from "lucide-react";
import CreateBudgetForm from "@/components/dashboard/budget/CreateBudgetForm";
import { Button } from "@/components/ui/button";

import { getBudgetsQueryOptions } from "@/lib/api/budget";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/hooks/useAuthContext";
import {
  DEFAULT_MONTH_STRING,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createLazyFileRoute("/_dashboard-layout/budget/")({
  component: Budget,
});

function Budget() {
  const {
    auth: { user },
  } = useAuthContext();
  const [isCreating, setIsCreating] = useState(false);

  const budgetsQuery = useSuspenseQuery(getBudgetsQueryOptions);
  const { data: budgets } = budgetsQuery;

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
    <div className="h-full overflow-y-auto scrollbar-thin lg:overflow-y-hidden lg:p-8">
      <header className="space-y-1 lg:space-y-2">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
          All your budgets in one place.
        </h1>
        <p className="text-sm text-muted-foreground">
          Select and manage your existing budgets as you wish or create new
          ones!
        </p>
      </header>
      <section className="h-full py-10 md:pt-20">
        <ScrollArea className="h-full w-full min-w-[650px] pb-10 pr-4">
          <div className="sticky top-0 grid w-full grid-cols-10 gap-x-4 rounded-t-lg border-x border-t bg-muted p-4 text-lg font-semibold tracking-wide">
            <p className="col-span-3 min-w-[150px]">Name</p>
            <p className="col-span-2 min-w-[100px]">Currency</p>
            <p className="col-span-5 min-w-[250px]">Members</p>
          </div>
          <ul className="rounded-b-lg border">
            {budgets.map(({ id, name, currency, budgetMembers }) => (
              <li className="grid w-full grid-cols-10 items-center text-lg">
                <Link
                  to={`/budget/${id}`}
                  params={{ budgetId: id }}
                  search={{
                    month: DEFAULT_MONTH_STRING,
                    year: DEFAULT_YEAR_STRING,
                    accMonth: DEFAULT_MONTH_STRING,
                    accYear: DEFAULT_YEAR_STRING,
                  }}
                  mask={{ to: `/budget/${id}` }}
                  className="group peer col-span-9 grid w-full grid-cols-9 gap-x-4 px-4 py-8 hover:bg-accent"
                >
                  <p className="col-span-3 min-w-[150px]">{name}</p>
                  <p className="col-span-2 min-w-[100px]">{currency}</p>
                  <div className="col-span-4 grid min-w-[250px] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {budgetMembers.map((member) => (
                      <p
                        key={id}
                        className="truncate rounded-full border px-2 text-center"
                      >
                        {member.username === user?.username
                          ? "You"
                          : member.username}
                      </p>
                    ))}
                  </div>
                </Link>
                <div className="col-span-1 flex h-full min-w-[50px] items-center justify-center peer-hover:bg-accent">
                  <Button size="icon" variant="ghost">
                    <Ellipsis />
                  </Button>
                </div>
              </li>
            ))}

            <li
              className={cn(
                "grid grid-rows-[0fr] overflow-hidden transition-all duration-300 ease-in-out",
                isCreating && user && "grid-rows-[1fr] border-t",
              )}
            >
              <div className="overflow-hidden">
                <CreateBudgetForm setIsCreating={setIsCreating} user={user!} />
              </div>
            </li>
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
      </section>
    </div>
  );
}
