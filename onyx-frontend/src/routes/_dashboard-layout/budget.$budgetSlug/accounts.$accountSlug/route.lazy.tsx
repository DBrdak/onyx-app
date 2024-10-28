import { useEffect, useMemo, useRef } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";

import AccountCard from "@/components/dashboard/accounts/accountCard/AccountCard";
import TransactionsTable from "@/components/dashboard/accounts/transactionsTable/TransactionsTable";

import {
  getTransactionsQueryKey,
  getTransactionsQueryOptions,
} from "@/lib/api/transaction";
import { getAccountsQueryOptions } from "@/lib/api/account";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { useSelectableCategories } from "@/lib/hooks/useSelectableCategories";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import {
  useAccountDateRangeEnd,
  useAccountDateRangeStart,
  useAccountId,
} from "@/store/dashboard/accountStore";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/accounts/$accountSlug",
)({
  component: Account,
});

function Account() {
  const queryClient = useQueryClient();

  const budgetId = useBudgetId();
  const accountId = useAccountId();
  const dateRangeStart = useAccountDateRangeStart();
  const dateRangeEnd = useAccountDateRangeEnd();

  const [{ data: transactions }, { data: accounts }] = useSuspenseQueries({
    queries: [
      getTransactionsQueryOptions(budgetId, accountId, {
        accountId,
        dateRangeEnd,
        dateRangeStart,
      }),
      getAccountsQueryOptions(budgetId),
      getCategoriesQueryOptions(budgetId),
    ],
  });

  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === accountId),
    [accountId, accounts],
  );

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      if (dateRangeStart && dateRangeEnd) {
        queryClient.invalidateQueries({
          queryKey: getTransactionsQueryKey(accountId),
        });
      }
    } else {
      hasMounted.current = true;
    }
  }, [dateRangeStart, dateRangeEnd]);

  if (!selectedAccount) throw new Error("Incorrect account ID");

  const selectableCategories = useSelectableCategories({ budgetId });

  const disabled = !selectableCategories || !selectableCategories.length;

  return (
    <>
      <AccountCard
        selectedAccount={selectedAccount}
        accounts={accounts}
        transactions={transactions}
        disabled={disabled}
      />
      <TransactionsTable
        selectedAccount={selectedAccount}
        transactions={transactions}
        disabled={disabled}
      />
    </>
  );
}
