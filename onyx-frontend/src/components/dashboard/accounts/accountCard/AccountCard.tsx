import { FC, useMemo } from "react";
import { Link } from "@tanstack/react-router";

import { ArrowLeft, ArrowRight } from "lucide-react";
import AccountCardNameForm from "@/components/dashboard/accounts/accountCard/AccountCardNameForm";
import AccountCardDeleteButton from "@/components/dashboard/accounts/accountCard/AccountCardDeleteButton";
import AccountCardFilters from "@/components/dashboard/accounts/accountCard/AccountCardFilters";
import { Button } from "@/components/ui/button";

import { cn, getFormattedCurrency } from "@/lib/utils";
import { type Account } from "@/lib/validation/account";
import { type Transaction } from "@/lib/validation/transaction";
import { useIsFetching } from "@tanstack/react-query";
import { getTransactionsQueryKey } from "@/lib/api/transaction";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

interface AccountCardProps {
  selectedAccount: Account;
  accounts: Account[];
  transactions: Transaction[];
  disabled: boolean;
}

const AccountCard: FC<AccountCardProps> = ({
  selectedAccount,
  accounts,
  transactions,
  disabled,
}) => {
  const budgetSlug = useBudgetStore.use.budgetSlug();

  const selectedAccountIndex = useMemo(
    () => accounts.findIndex((a) => a.id === selectedAccount.id),
    [accounts, selectedAccount.id],
  );

  const nextAccountSlug =
    selectedAccountIndex < accounts.length - 1 &&
    accounts[selectedAccountIndex + 1].slug;

  const prevAccountSlug =
    selectedAccountIndex !== 0 && accounts[selectedAccountIndex - 1].slug;

  const { expenses, income } = useMemo(
    () =>
      transactions.reduce(
        (a, c) => {
          const {
            amount: { amount },
          } = c;

          if (amount < 0) {
            a.expenses += amount;
          } else {
            a.income += amount;
          }

          return a;
        },
        {
          expenses: 0,
          income: 0,
        },
      ),
    [transactions],
  );

  const isFetchingTransactions =
    useIsFetching({ queryKey: getTransactionsQueryKey(selectedAccount.id) }) >
    0;

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 gap-y-10 rounded-xl border bg-card p-4 shadow-md md:grid-cols-2 md:gap-x-10 md:gap-y-0 lg:gap-x-20",
        selectedAccount.optimistic && "opacity-50",
      )}
    >
      {nextAccountSlug && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-full lg:inline-flex"
          asChild
          disabled={isFetchingTransactions}
        >
          <Link
            to={`/budget/${budgetSlug}/accounts/${nextAccountSlug}`}
            search={(prev) => prev}
            mask={{
              to: `/budget/${budgetSlug}/accounts/${nextAccountSlug}`,
            }}
            preload={false}
          >
            <ArrowRight />
          </Link>
        </Button>
      )}
      {prevAccountSlug && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-full disabled:opacity-50 lg:inline-flex"
          asChild
          disabled={isFetchingTransactions}
        >
          <Link
            to={`/budget/${budgetSlug}/accounts/${prevAccountSlug}`}
            search={(prev) => prev}
            mask={{
              to: `/budget/${budgetSlug}/accounts/${prevAccountSlug}`,
            }}
            preload={false}
          >
            <ArrowLeft />
          </Link>
        </Button>
      )}

      <div className="w-full max-w-[360px] space-y-2 justify-self-center rounded-xl bg-gradient-to-b from-primary via-primary to-primaryDark p-4 text-primary-foreground shadow-lg shadow-primaryDark/50 md:justify-self-end">
        <div className="flex items-center space-x-2 text-lg text-primary-foreground md:text-2xl">
          <div className="flex-1">
            <AccountCardNameForm
              defaultName={selectedAccount.name}
              accountId={selectedAccount.id}
              disabled={isFetchingTransactions}
            />
          </div>
          <AccountCardDeleteButton
            accountId={selectedAccount.id}
            disabled={isFetchingTransactions}
          />
        </div>
        <div className="pl-3">
          <span className="text-xs">BALANCE</span>
          <p className="text-2xl font-light">
            {selectedAccount.balance.amount} {selectedAccount.balance.currency}
          </p>
        </div>
        <div className="flex w-full justify-end space-x-4 pr-3">
          <span className="text-sm">Account type:</span>
          <span className="text-sm tracking-wide">
            {selectedAccount.type.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="m-auto w-full max-w-[400px] space-y-10 md:mx-0 md:my-auto md:space-y-6 lg:justify-self-start">
        <AccountCardFilters disabled={disabled} />
        <div className="grid h-fit grid-cols-2 md:w-full">
          <div className="mr-2 space-y-2 px-1">
            <h3 className="text-xl font-semibold">Income:</h3>
            <p
              className={cn(
                "space-x-2 text-lg font-semibold text-primary",
                isFetchingTransactions && "animate-pulse opacity-50",
              )}
            >
              {getFormattedCurrency(income, selectedAccount.balance.currency)}
            </p>
          </div>
          <div className="ml-2 space-y-2 px-1">
            <h3 className="text-xl font-semibold">Expenses:</h3>
            <p
              className={cn(
                "space-x-2 text-lg font-semibold text-destructive",
                isFetchingTransactions && "animate-pulse opacity-50",
              )}
            >
              {getFormattedCurrency(expenses, selectedAccount.balance.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
