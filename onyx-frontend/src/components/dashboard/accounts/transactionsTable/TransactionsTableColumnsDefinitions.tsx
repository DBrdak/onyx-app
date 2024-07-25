import { Dispatch, SetStateAction } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { parse, isValid } from "date-fns";

import TransactionsTableColumnsSortButton from "@/components/dashboard/accounts/transactionsTable/TransactionsTableColumnsSortButton";
import SubcategoriesPopover from "@/components/dashboard/accounts/SubcategoriesPopover";
import { Checkbox } from "@/components/ui/checkbox";

import { cn, getFormattedCurrency } from "@/lib/utils";
import { ImportTransactionsPresubmitState } from "@/lib/validation/transaction";
import { Money } from "@/lib/validation/base";

interface BaseTableData {
  [key: string]: unknown;
}

export const createSelectColumn = <
  T extends BaseTableData,
>(): ColumnDef<T> => ({
  id: "select",
  header: ({ table }) => (
    <div className="flex items-center overflow-hidden">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex items-center overflow-hidden">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  ),
});
export const createDateColumn = <T extends BaseTableData>(
  accessorFn: (row: T) => string,
): ColumnDef<T> => ({
  accessorFn,
  id: "date",
  header: ({ column, table }) => (
    <TransactionsTableColumnsSortButton
      column={column}
      label="Date"
      table={table}
    />
  ),
  cell: ({ row }) => <div className="pl-4">{row.getValue("date")}</div>,
  sortingFn: (rowA, rowB, columnId) => {
    const parseFormattedDate = (dateString: string) => {
      return parse(dateString, "PP", new Date());
    };

    const a = parseFormattedDate(rowA.getValue(columnId));
    const b = parseFormattedDate(rowB.getValue(columnId));

    if (!isValid(a) && !isValid(b)) return 0;
    if (!isValid(a)) return 1;
    if (!isValid(b)) return -1;

    return a.getTime() - b.getTime();
  },
  sortDescFirst: true,
});

export const createTextColumn = <T extends BaseTableData>(
  id: string,
  label: string,
  accessorKey: string,
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  id,
  header: ({ column, table }) => (
    <TransactionsTableColumnsSortButton
      column={column}
      label={label}
      table={table}
    />
  ),
  cell: ({ row }) => (
    <div className="pl-4 capitalize">{row.getValue(id) || "N/A"}</div>
  ),
  sortUndefined: "last",
});

export const createAmountColumn = <T extends BaseTableData>(
  accessorKey: string,
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
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
    const amount = Number(row.getValue("amount")) || 0;
    const currency = row.original.amount as Money;
    const formatted = getFormattedCurrency(amount, currency.currency);

    return (
      <div
        className={cn(
          "flex justify-end space-x-1 pr-5 font-semibold",
          amount < 0 ? "text-destructive" : "text-primary",
        )}
      >
        {formatted}
      </div>
    );
  },
});

export const createSubcategorySelectColumn = <T extends BaseTableData>(
  budgetId: string,
  setState: Dispatch<SetStateAction<ImportTransactionsPresubmitState[]>>,
): ColumnDef<T> => ({
  accessorKey: "subcategoryId",
  id: "subcategoryId",
  header: ({ column, table }) => (
    <TransactionsTableColumnsSortButton
      column={column}
      label="Subcategory"
      table={table}
    />
  ),
  cell: ({ row }) => {
    const subcategoryName = row.original.subcategoryName as string | null;
    const amount = row.original.amount as number;
    const index = row.index;

    const handleChange = (value: string, label: string) => {
      setState((prev) =>
        prev.map((t, i) =>
          i === index
            ? { ...t, subcategoryId: value, subcategoryName: label }
            : t,
        ),
      );
    };

    return (
      <div className="pl-4">
        <SubcategoriesPopover
          selectedSubcategoryName={subcategoryName}
          budgetId={budgetId}
          onChange={handleChange}
          disabled={amount > 0}
        />
      </div>
    );
  },
});
