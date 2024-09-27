import { useMemo } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQueries } from "@tanstack/react-query";

import AccountCard from "@/components/dashboard/accounts/accountCard/AccountCard";
import TransactionsTable from "@/components/dashboard/accounts/transactionsTable/TransactionsTable";

import { getTransactionsQueryOptions } from "@/lib/api/transaction";
import { getAccountsQueryOptions } from "@/lib/api/account";
import { getCategoriesQueryOptions } from "@/lib/api/category";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
)({
  component: Account,
});

function Account() {
  const { accountId, budgetId } = Route.useParams();
  const { accDate, accPeriod } = Route.useSearch();

  const [{ data: transactions }, { data: accounts }] = useSuspenseQueries({
    queries: [
      getTransactionsQueryOptions(budgetId, accountId, {
        accountId,
        date: accDate,
        period: accPeriod,
      }),
      getAccountsQueryOptions(budgetId),
      getCategoriesQueryOptions(budgetId),
    ],
  });

  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === accountId),
    [accountId, accounts],
  );

  if (!selectedAccount) throw new Error("Incorrect account ID");

  return (
    <div>
      <AccountCard
        selectedAccount={selectedAccount}
        accounts={accounts}
        budgetId={budgetId}
        transactions={transactions}
      />
      <TransactionsTable
        selectedAccount={selectedAccount}
        transactions={transactions}
      />
    </div>
  );
}
