import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ArrowLeft } from "lucide-react";
import TransactionTableSizeFilter from "@/components/dashboard/accounts/transactionsTable/TransactionTableSizeFilter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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

import { cn, getErrorMessage } from "@/lib/utils";
import {
  ImportTransactionsPresubmitState,
  ImportTransactionsSubmitStageArraySchema,
} from "@/lib/validation/transaction";
import { useTransactionsDataTable } from "@/lib/hooks/useTransactionsDataTable";
import {
  createTransactions,
  getTransactionsQueryKey,
} from "@/lib/api/transaction";
import LoadingButton from "@/components/LoadingButton";
import { getAccountsQueryOptions } from "@/lib/api/account";
import { VARIANTS } from "../TransactionsTable";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import { useAccountId } from "@/store/dashboard/accountStore";

interface ImportTableSubmitStageProps {
  data: ImportTransactionsPresubmitState[];
  setVariant: Dispatch<SetStateAction<VARIANTS>>;
  setSubmitVariantData: Dispatch<
    SetStateAction<ImportTransactionsPresubmitState[]>
  >;
  setDefaultTableVariant: () => void;
}

const ImportTableSubmitStage: FC<ImportTableSubmitStageProps> = ({
  data,
  setSubmitVariantData,
  setVariant,
  setDefaultTableVariant,
}) => {
  const budgetId = useBudgetId();
  const accountId = useAccountId();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: performCreateTransactions, isPending } = useMutation({
    mutationFn: createTransactions,
    onError: (err) => {
      console.log(err);
      const description = getErrorMessage(err);
      return toast({
        title: "Error",
        variant: "destructive",
        description,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey(accountId),
      });
      await queryClient.invalidateQueries({
        queryKey: getAccountsQueryOptions(budgetId).queryKey,
      });
      setDefaultTableVariant();
    },
  });

  const onCreate = () => {
    const validatedData =
      ImportTransactionsSubmitStageArraySchema.safeParse(data);

    if (!validatedData.success) {
      const dateValidationError = validatedData.error.errors.find(
        (error) =>
          error.path.includes("transactedAt") &&
          error.message.includes("older than 5 years"),
      );

      if (dateValidationError) {
        return toast({
          title: "Date error",
          variant: "destructive",
          description: "The transaction date cannot be older than 5 years.",
        });
      }

      console.log(validatedData.error.errors);
      return toast({
        title: "Data error",
        variant: "destructive",
        description: "Please check all selected data values.",
      });
    }

    performCreateTransactions({
      budgetId,
      accountId,
      transactions: validatedData.data,
    });
  };

  const columns: ColumnDef<ImportTransactionsPresubmitState>[] = useMemo(
    () => [
      createSelectColumn(isPending),
      createDateColumn("transactedAt"),
      createTextColumn("counterparty", "Counterparty", "counterpartyName"),
      createSubcategorySelectColumn(budgetId, setSubmitVariantData, isPending),
      createAmountColumn("amount.amount"),
    ],
    [budgetId, setSubmitVariantData, isPending],
  );

  const { table, globalFilter, setGlobalFilter } = useTransactionsDataTable({
    data,
    columns,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const onSelectedRowsDelete = () => {
    setSubmitVariantData((prev) => {
      const selectedIndexes = new Set(selectedRows.map((r) => r.index));
      return prev.filter((_, index) => !selectedIndexes.has(index));
    });
    table.resetRowSelection();
  };

  const isCreateDisabled = useMemo(
    () => data.some((t) => t.amount.amount < 0 && !t.subcategoryId),
    [data],
  );

  const onBack = () => {
    setVariant(VARIANTS.IMPORT);
    setSubmitVariantData([]);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col justify-between space-y-2 py-4 md:flex-row md:space-x-2 md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button onClick={onBack} variant="outline" disabled={isPending}>
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
            disabled={data.length === 0 || isPending}
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-1/2"
          />
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <TransactionTableSizeFilter disabled={isPending} />
          <LoadingButton
            onClick={onCreate}
            disabled={isCreateDisabled || isPending}
            className="md:px-8"
            isLoading={isPending}
          >
            Create
          </LoadingButton>
        </div>
      </div>
      <ScrollArea className="h-full flex-grow overflow-auto">
        <DataTable
          columns={columns}
          table={table}
          className="bg-card"
          cellClassName="py-2"
          disabled={isPending}
        />
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  );
};

export default ImportTableSubmitStage;
