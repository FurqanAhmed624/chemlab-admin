'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// UI Component Imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

// Local project-specific imports for Waste
import { Waste } from '../data/schema';
import { WasteColumn, columns } from './columns';
import { WasteHistoryModal } from './waste-history-modal'; // Assuming modal is in its own file
import {
  GET_ALL_WASTE_WITH_HISTORY as GET_ALL_WASTE,
  GetAllWasteData,
  GetAllWasteVars,
} from '../graphql/queries';

// The main component that fetches and displays the list of waste records
export default function WasteListPage() {
  const [selectedWaste, setSelectedWaste] = useState<Waste | null>(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const queryVariables = useMemo<GetAllWasteVars>(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }), [pagination]);

  const { data, loading, error } = useQuery<GetAllWasteData, GetAllWasteVars>(
    GET_ALL_WASTE,
    { variables: queryVariables }
  );

  const viewHistory = (waste: Waste) => {
    setSelectedWaste(waste);
  };

  const tableData = useMemo<WasteColumn[]>(() => {
    const wasteItems = data?.getAllWasteWithHistory.items ?? [];
    return wasteItems.map((waste) => ({
      ...waste,
      viewHistory,
    }));
  }, [data]);

  const pageCount = data ? Math.ceil(data.getAllWasteWithHistory.count / pagination.pageSize) : -1;

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className='flex items-center justify-center h-48 rounded-md border'>
        <p className='text-red-500'>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>{columns.map((col, j) => (
                  <TableCell key={`skeleton-cell-${j}`}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                ))}</TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>{row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}</TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className='h-24 text-center'>No results.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && <DataTablePagination table={table} />}

      <WasteHistoryModal
        waste={selectedWaste}
        onClose={() => setSelectedWaste(null)}
      />
    </div>
  );
}