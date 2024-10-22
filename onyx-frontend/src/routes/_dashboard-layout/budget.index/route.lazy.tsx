import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import BudgetsTable from "@/components/dashboard/budgets/budgetsTable/BudgetsTable";
import { useToast } from "@/components/ui/use-toast";

import { getBudgetsQueryOptions } from "@/lib/api/budget";

export const Route = createLazyFileRoute("/_dashboard-layout/budget/")({
  component: Budget,
});

function Budget() {
  const budgetsQuery = useSuspenseQuery(getBudgetsQueryOptions);
  const { data: budgets } = budgetsQuery;
  const { message } = Route.useSearch();
  const { toast } = useToast();

  useEffect(() => {
    if (message) {
      toast({
        variant: "destructive",
        description: message,
      });
    }
  }, []);

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
        <BudgetsTable budgets={budgets} />
      </section>
    </div>
  );
}
