import { createFileRoute } from "@tanstack/react-router";

import RouteLoadingError from "@/components/RouteLoadingError";
import AccountsLoadingSkeleton from "@/components/dashboard/accounts/AccountsLoadingSkeleton";

import { getAccountsQueryOptions } from "@/lib/api/account";
import { getTransactionsQueryOptions } from "@/lib/api/transaction";
import { SingleBudgetPageParamsSchema } from "@/lib/validation/searchParams";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { initializeBudgetStore } from "@/store/dashboard/boundDashboardStore";
import {
  getAccountDate,
  getAccountDateRangeEnd,
  getAccountDateRangeStart,
  getAccountPeriod,
  initializeAccountId,
} from "@/store/dashboard/accountStore";

export const Route = createFileRoute(
  "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
)({
  beforeLoad: ({ params: { budgetId, accountId } }) => {
    initializeBudgetStore(budgetId);
    initializeAccountId(accountId);
  },
  loader: async ({
    context: { queryClient },
    params: { budgetId, accountId },
  }) => {
    const accDate = getAccountDate();
    const accPeriod = getAccountPeriod();
    const dateRangeEnd = getAccountDateRangeEnd();
    const dateRangeStart = getAccountDateRangeStart();
    Promise.all([
      queryClient.ensureQueryData(
        getTransactionsQueryOptions(budgetId, accountId, {
          accountId,
          date: accDate,
          period: accPeriod,
          dateRangeEnd,
          dateRangeStart,
        }),
      ),
      queryClient.ensureQueryData(getAccountsQueryOptions(budgetId)),
      queryClient.ensureQueryData(getCategoriesQueryOptions(budgetId)),
    ]);
  },
  pendingComponent: () => <AccountsLoadingSkeleton />,
  errorComponent: ({ reset }) => <RouteLoadingError reset={reset} />,
  validateSearch: SingleBudgetPageParamsSchema,
});
