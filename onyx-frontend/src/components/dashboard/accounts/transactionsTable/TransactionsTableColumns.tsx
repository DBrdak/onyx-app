import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Ellipsis } from "lucide-react";
import TransactionsTableColumnsSortButton from "@/components/dashboard/accounts/transactionsTable/TransactionsTableColumnsSortButton";
import {
  createDateColumn,
  createSelectColumn,
  createTextColumn,
} from "@/components/dashboard/accounts/transactionsTable/TransactionsTableColumnsDefinitions";

import { Transaction } from "@/lib/validation/transaction";
import { cn, getFormattedCurrency } from "@/lib/utils";

export const columns: ColumnDef<Transaction>[] = [
  createSelectColumn(),
  createDateColumn((row) => format(new Date(row.transactedAt), "PP")),
  createTextColumn("counterparty", "Counterparty", "counterparty.name"),
  createTextColumn("subcategory", "Subcategory", "subcategory.name"),
  {
    accessorKey: "amount.amount",
    id: "amount",
    header: ({ column, table }) => (
      <div className="text-right">
        <TransactionsTableColumnsSortButton
          column={column}
          label="Amount"
          table={table}
        />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.amount.currency;
      const accCurrency = row.original.account.balance.currency;
      const formatted = getFormattedCurrency(amount, currency);

      return (
        <div
          className={cn(
            "flex justify-end space-x-1 pr-5 font-semibold",
            amount < 0 ? "text-destructive" : "text-primary",
          )}
        >
          <span>
            {accCurrency === currency ? (
              formatted
            ) : (
              <Ellipsis className="animate-pulse" />
            )}
          </span>
        </div>
      );
    },
  },
];
