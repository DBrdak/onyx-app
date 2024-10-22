import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
  PaginationState,
} from "@tanstack/react-table";
import { useDebounce } from "./useDebounce";
import { useAccountTableSize } from "@/store/dashboard/accountStore";

interface Props<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageSize?: number;
}

export function useTransactionsDataTable<TData, TValue>({
  data,
  columns,
  pageSize = 8,
}: Props<TData, TValue>) {
  const tableSize = useAccountTableSize();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  useEffect(() => {
    if (tableSize === pagination.pageSize && pagination.pageIndex === 0) return;

    setPagination(() => ({ pageIndex: 0, pageSize: tableSize }));
  }, [tableSize]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      pagination,
      globalFilter: debouncedGlobalFilter,
      rowSelection,
    },
  });

  return { table, globalFilter, setGlobalFilter, setRowSelection };
}
