import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { Input } from "@/components/ui/input";
import DeleteTransactionDialog from "@/components/dashboard/accounts/DeleteTransactionDialog";
import {
  createAmountColumn,
  createDateColumn,
  createSelectColumn,
  createSubcategorySelectColumn,
  createTextColumn,
} from "@/components/dashboard/accounts/transactionsTable/TransactionsTableColumnsDefinitions";

import {
  ImportTransactionsPresubmitState,
  ImportTransactionsSubmitStageArraySchema,
} from "@/lib/validation/transaction";
import { useTransactionsDataTable } from "@/lib/hooks/useTransactionsDataTable";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ImportTableSubmitStageProps {
  data: ImportTransactionsPresubmitState[];
  onBack: () => void;
  setSubmitStageData: Dispatch<
    SetStateAction<ImportTransactionsPresubmitState[]>
  >;
}

const ImportTableSubmitStage: FC<ImportTableSubmitStageProps> = ({
  data,
  onBack,
  setSubmitStageData,
}) => {
  const { budgetId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });

  const columns: ColumnDef<ImportTransactionsPresubmitState>[] = useMemo(
    () => [
      createSelectColumn(),
      createDateColumn((row) => format(new Date(row.transactedAt), "PP")),
      createTextColumn("counterparty", "Counterparty", "counterpartyName"),
      createSubcategorySelectColumn(budgetId, setSubmitStageData),
      createAmountColumn("amount.amount"),
    ],
    [budgetId, setSubmitStageData],
  );

  const { table, globalFilter, setGlobalFilter } = useTransactionsDataTable({
    data,
    columns,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const onSelectedRowsDelete = () => {
    setSubmitStageData((prev) => {
      const selectedIndexes = new Set(selectedRows.map((r) => r.index));
      return prev.filter((_, index) => !selectedIndexes.has(index));
    });
    table.resetRowSelection();
  };

  const { toast } = useToast();

  const onCreate = () => {
    const validatedData =
      ImportTransactionsSubmitStageArraySchema.safeParse(data);

    if (!validatedData.data || validatedData.error) {
      console.log(validatedData.error.errors);
      return toast({
        title: "Data error",
        variant: "destructive",
        description: "Please check all selected data values.",
      });
    }

    console.log(validatedData.data);
  };

  const isCreateDisabled = useMemo(
    () => data.some((t) => t.amount.amount < 0 && !t.subcategoryId),
    [data],
  );

  return (
    <div className="pt-3">
      <div className="flex flex-col justify-between space-y-2 py-4 md:flex-row md:space-x-2 md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <div
            className={cn("invisible", selectedRows.length > 0 && "visible")}
          >
            <DeleteTransactionDialog
              rowsToDeleteLength={selectedRows.length}
              onDelete={onSelectedRowsDelete}
              isError={false}
            />
          </div>
        </div>
        <div className="flex flex-grow justify-center">
          <Input
            disabled={data.length === 0}
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-1/2"
          />
        </div>

        <Button
          onClick={onCreate}
          disabled={isCreateDisabled}
          className="md:px-8"
        >
          Create
        </Button>
      </div>
      <DataTable
        columns={columns}
        table={table}
        className="bg-card"
        cellClassName="py-2"
      />
      <DataTablePagination table={table} />
    </div>
  );
};

export default ImportTableSubmitStage;
