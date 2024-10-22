import { createFileRoute, redirect } from "@tanstack/react-router";

import RouteLoadingError from "@/components/RouteLoadingError";
import AccountsLoadingSkeleton from "@/components/dashboard/accounts/AccountsLoadingSkeleton";

import { getAccountsQueryOptions } from "@/lib/api/account";
import { getTransactionsQueryOptions } from "@/lib/api/transaction";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { initializeBudgetStore } from "@/store/dashboard/boundDashboardStore";
import {
  getAccountDate,
  getAccountDateRangeEnd,
  getAccountDateRangeStart,
  getAccountId,
  getAccountPeriod,
  initializeAccountId,
} from "@/store/dashboard/accountStore";
import { getBudgetId } from "@/store/dashboard/budgetStore";
import { findBudgetBySlug } from "..";

export const Route = createFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/accounts/$accountSlug",
)({
  beforeLoad: async ({
    params: { budgetSlug, accountSlug },
    context: { queryClient },
  }) => {
    const budget = await findBudgetBySlug(queryClient, budgetSlug);
    initializeBudgetStore(budget.id, budgetSlug);

    const accounts =
      queryClient.getQueryData(getAccountsQueryOptions(budget.id).queryKey) ??
      (await queryClient.fetchQuery(getAccountsQueryOptions(budget.id)));

    if (!accounts || accounts.length === 0) {
      throw redirect({
        to: "/budget",
        search: { message: "You do not have any created budgets." },
        mask: {
          to: "/budget",
        },
      });
    }

    const account = accounts.find((a) => a.slug === accountSlug);

    if (!account) {
      throw redirect({
        to: "/budget",
        search: {
          message: `You do not have a account named "${accountSlug}".`,
        },
        mask: {
          to: "/budget",
        },
      });
    }

    initializeAccountId(account.id, accountSlug);
  },
  loader: async ({ context: { queryClient } }) => {
    const accDate = getAccountDate();
    const accPeriod = getAccountPeriod();
    const dateRangeEnd = getAccountDateRangeEnd();
    const dateRangeStart = getAccountDateRangeStart();
    const budgetId = getBudgetId();
    const accountId = getAccountId();
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
});
