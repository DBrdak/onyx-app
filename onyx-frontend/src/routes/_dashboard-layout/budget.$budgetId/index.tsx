import { createFileRoute } from "@tanstack/react-router";

import SingleBudgetLoadingSkeleton from "@/components/dashboard/budget/SingleBudgetLoadingSkeleton";
import RouteLoadingError from "@/components/RouteLoadingError";

import { SingleBudgetPageParamsSchema } from "@/lib/validation/searchParams";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { getToAssignQueryOptions } from "@/lib/api/budget";
import { getAccountsQueryOptions } from "@/lib/api/account";
import {
  getBudgetId,
  getBudgetMonth,
  getBudgetYear,
} from "@/store/dashboard/budgetStore";
import { initializeBudgetStore } from "@/store/dashboard/boundDashboardStore";

export const Route = createFileRoute("/_dashboard-layout/budget/$budgetId/")({
  beforeLoad: async ({ params: { budgetId } }) => {
    initializeBudgetStore(budgetId);
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
  validateSearch: SingleBudgetPageParamsSchema,
});
