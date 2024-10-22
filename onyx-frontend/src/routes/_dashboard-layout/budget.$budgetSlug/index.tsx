import { createFileRoute, redirect } from "@tanstack/react-router";

import SingleBudgetLoadingSkeleton from "@/components/dashboard/budget/SingleBudgetLoadingSkeleton";
import RouteLoadingError from "@/components/RouteLoadingError";

import { getCategoriesQueryOptions } from "@/lib/api/category";
import {
  getBudgetsQueryOptions,
  getToAssignQueryOptions,
} from "@/lib/api/budget";
import { getAccountsQueryOptions } from "@/lib/api/account";
import {
  getBudgetId,
  getBudgetMonth,
  getBudgetYear,
} from "@/store/dashboard/budgetStore";
import { initializeBudgetStore } from "@/store/dashboard/boundDashboardStore";
import { type QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_dashboard-layout/budget/$budgetSlug/")({
  beforeLoad: async ({ params: { budgetSlug }, context: { queryClient } }) => {
    const budget = await findBudgetBySlug(queryClient, budgetSlug);
    initializeBudgetStore(budget.id, budgetSlug);
  },
  loader: ({ context: { queryClient } }) => {
    const budgetId = getBudgetId();
    const month = getBudgetMonth();
    const year = getBudgetYear();

    Promise.all([
      queryClient.ensureQueryData(getCategoriesQueryOptions(budgetId)),
      queryClient.ensureQueryData(
        getToAssignQueryOptions({ budgetId, month, year }),
      ),
      queryClient.ensureQueryData(getAccountsQueryOptions(budgetId)),
    ]);
  },
  pendingComponent: () => <SingleBudgetLoadingSkeleton />,
  errorComponent: ({ reset }) => <RouteLoadingError reset={reset} />,
});

export const findBudgetBySlug = async (
  queryClient: QueryClient,
  slug: string,
) => {
  const budgets =
    queryClient.getQueryData(getBudgetsQueryOptions.queryKey) ??
    (await queryClient.fetchQuery(getBudgetsQueryOptions));

  if (!budgets || budgets.length === 0) {
    throw redirect({
      to: "/budget",
      search: { message: "You do not have any created budgets." },
      mask: {
        to: "/budget",
      },
    });
  }

  const budget = budgets.find((b) => b.slug === slug);

  if (!budget) {
    throw redirect({
      to: "/budget",
      search: { message: `You do not have a budget named "${slug}".` },
      mask: {
        to: "/budget",
      },
    });
  }

  return budget;
};
