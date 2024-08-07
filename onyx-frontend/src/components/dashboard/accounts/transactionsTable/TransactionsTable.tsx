import { FC, useCallback, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { flexRender } from "@tanstack/react-table";

import { Minus, Plus } from "lucide-react";
import CreateTransactionTableForm from "@/components/dashboard/accounts/transactionsTable/TransactionsTableCreateForm";
import { columns } from "@/components/dashboard/accounts/transactionsTable/TransactionsTableColumns";
import CreateTransactionButton from "@/components/dashboard/accounts/transactionsTable/TransactionTableCreateModal";
import DeleteTransactionsButton from "@/components/dashboard/accounts/transactionsTable/TransactionsTableDeleteButton";
import ImportTransactionsButton from "@/components/dashboard/accounts/transactionsTable/TransactionsTableImportButton";
import ImportTableSelectStage from "@/components/dashboard/accounts/transactionsTable/importTable/ImportTableSelectStage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { Transaction } from "@/lib/validation/transaction";
import { Account } from "@/lib/validation/account";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { useDataTable } from "@/lib/hooks/useDataTable";
import { useSelectableCategories } from "@/lib/hooks/useSelectableCategories";

interface TransactionsTable {
  transactions: Transaction[];
  selectedAccount: Account;
}

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsTable: FC<TransactionsTable> = ({
  transactions,
  selectedAccount,
}) => {
  const { budgetId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const isLargeDevice = useMediaQuery("(min-width: 1024px)");
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const { table, globalFilter, setGlobalFilter, setRowSelection } =
    useDataTable({
      data: transactions,
      columns,
    });
  const selectableCategories = useSelectableCategories({ budgetId });

  const onUpload = useCallback((results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  }, []);

  const onCencel = useCallback(() => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  }, []);

  if (variant === VARIANTS.IMPORT) {
    return (
      <ImportTableSelectStage data={importResults.data} onCencel={onCencel} />
    );
  }

  if (!selectableCategories)
    return (
      <div className="w-full pt-20 text-center">
        <h2 className="text-lg font-semibold">
          Please create some categories and subcategories first, then add
          transactions.
        </h2>
      </div>
    );

  return (
    <div className="pt-3">
      <div className="flex flex-col justify-between space-y-2 py-4 md:flex-row md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          {isLargeDevice ? (
            <Button
              variant="outline"
              className="space-x-2"
              onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}
            >
              {isCreateFormVisible ? (
                <Minus className="inline-flex size-5 flex-shrink-0" />
              ) : (
                <Plus className="inline-flex size-5 flex-shrink-0" />
              )}
              <span className="inline-flex">
                {isCreateFormVisible ? "Hide" : "Create"}
              </span>
            </Button>
          ) : (
            <CreateTransactionButton account={selectedAccount} />
          )}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DeleteTransactionsButton
              rows={table.getFilteredSelectedRowModel().rows}
              setRowsSelection={setRowSelection}
            />
          )}
          <ImportTransactionsButton onUpload={onUpload} />
        </div>
        <Input
          disabled={transactions.length === 0}
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:max-w-xs"
        />
      </div>
      <Card>
        <Table>
          <TableHeader className="overflow-hidden bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLargeDevice && (
              <TableRow
                className={cn(!isCreateFormVisible && "border-none py-0")}
              >
                <TableCell id="none" colSpan={columns.length} className="py-0">
                  <div
                    className={cn(
                      "grid grid-rows-[0fr] transition-all duration-300",
                      isCreateFormVisible && "grid-rows-[1fr] py-2",
                    )}
                  >
                    <div className="overflow-hidden">
                      <CreateTransactionTableForm account={selectedAccount} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <DataTablePagination table={table} />
    </div>
  );
};

export default TransactionsTable;
