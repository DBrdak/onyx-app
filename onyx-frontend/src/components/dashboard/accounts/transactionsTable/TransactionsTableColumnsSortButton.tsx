import { Column, Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionsTableColumnsSortButtonProps<TData> {
  column: Column<TData, unknown>;
  label: string;
  table: Table<TData>;
}

function TransactionsTableColumnsSortButton<TData>({
  column,
  label,
  table,
}: TransactionsTableColumnsSortButtonProps<TData>) {
  const isSorted = column.getIsSorted();

  const hasValues = table.getRowModel().rows.some((row) => {
    const value = row.getValue(column.id);
    return value !== null && value !== undefined;
  });

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(undefined, true)}
      disabled={!hasValues}
    >
      <span className="inline-flex font-semibold tracking-wide">{label}</span>
      {isSorted === "asc" && (
        <ArrowUp className="ml-2 inline-flex h-4 w-4 shrink-0" />
      )}
      {isSorted === "desc" && (
        <ArrowDown className="ml-2 inline-flex h-4 w-4 shrink-0" />
      )}
      {isSorted === false && (
        <ArrowUpDown className="ml-2 inline-flex h-4 w-4 shrink-0" />
      )}
    </Button>
  );
}

export default TransactionsTableColumnsSortButton;
