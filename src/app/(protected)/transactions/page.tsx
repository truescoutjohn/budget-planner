"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { Filters, type Filter } from "@/components/reui/filters";
import { DEFAULT_PAGE_SIZE } from "@/constants/constants";
import { TRANSACTION_FILTER_FIELDS } from "@/constants/transaction-filter-fields";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ListFilterIcon, FunnelXIcon } from "lucide-react";
import { ITransactionResponse } from "@/types/transaction";
import { applyFiltersToTransactions } from "@/utils/filters";
import { getActiveFilters } from "@/utils/filters";
import { formatTransactionTime } from "@/utils/time";

// Helper to check if a filter has meaningful values
export function Transactions() {
  const [apiTransactions, setApiTransactions] = useState<
    ITransactionResponse[]
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "amount", desc: false },
  ]);
  const [filters, setFilters] = useState<Filter[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        if (!cancelled) {
          setApiTransactions(Array.isArray(data) ? data : []);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = useMemo(
    () => applyFiltersToTransactions(apiTransactions, filters),
    [apiTransactions, filters],
  );

  const handleFiltersChange = useCallback(
    (newFilters: Filter[]) => {
      const oldActive = getActiveFilters(filters);
      const newActive = getActiveFilters(newFilters);

      setFilters(newFilters);

      if (JSON.stringify(oldActive) === JSON.stringify(newActive)) {
        return;
      }

      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [filters],
  );

  const columns = useMemo<ColumnDef<ITransactionResponse>[]>(
    () => [
      {
        accessorKey: "number",
        id: "number",
        header: ({ column }) => (
          <DataGridColumnHeader title="Number" column={column} />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: "amount",
        id: "amount",
        header: ({ column }) => (
          <DataGridColumnHeader title="Amount" column={column} />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: "time",
        id: "time",
        header: ({ column }) => (
          <DataGridColumnHeader title="Time" column={column} />
        ),
        cell: ({ row }) => (
          <span>{formatTransactionTime(row.original.time)}</span>
        ),
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: "comment",
        id: "comment",
        header: ({ column }) => (
          <DataGridColumnHeader title="Comment" column={column} />
        ),
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "account",
        id: "account",
        header: ({ column }) => (
          <DataGridColumnHeader title="Account" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.account?.name ?? "—"}</span>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "category",
        id: "category",
        header: ({ column }) => (
          <DataGridColumnHeader title="Category" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.category?.name ?? "—"}</span>,
        size: 120,
        enableSorting: true,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  // TanStack Table exposes unstable function refs; React Compiler skips memo here by design.
  // eslint-disable-next-line react-hooks/incompatible-library -- @tanstack/react-table useReactTable
  const table = useReactTable({
    columns,
    data: filteredTransactions,
    pageCount: Math.ceil(
      (filteredTransactions?.length || 0) / pagination.pageSize,
    ),
    getRowId: (row: ITransactionResponse) => row.id?.toString() || "",
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-5xl m-auto self-start">
      {/* Filters Section */}
      <div className="mb-3.5 flex items-start gap-2.5">
        <div className="flex-1 items-center gap-2">
          <Filters
            filters={filters}
            fields={TRANSACTION_FILTER_FIELDS}
            onChange={handleFiltersChange}
            size="sm"
            trigger={
              <Button variant="outline" size="icon-sm">
                <ListFilterIcon />
              </Button>
            }
          />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters([]);
            }}
            disabled={isLoading}
          >
            <FunnelXIcon />
            Clear
          </Button>
        )}
      </div>

      {/* Data Grid */}
      <DataGrid
        table={table}
        isLoading={isLoading}
        loadingMode="skeleton"
        recordCount={filteredTransactions?.length || 0}
        tableLayout={{
          dense: true,
          columnsMovable: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>
    </div>
  );
}

export default Transactions;
