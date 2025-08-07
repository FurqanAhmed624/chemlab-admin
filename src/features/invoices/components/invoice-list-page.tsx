'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// UI Component Imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

// Local project-specific imports
import { Invoice } from '../data/schema';
import { InvoiceColumn, columns } from './columns';
import {
  GET_ALL_INVOICES,
  GET_VIEWABLE_INVOICE_URL,
  GetAllInvoicesData,
  GetAllInvoicesVars,
  GetViewableUrlData,
  GetViewableUrlVars,
} from '../graphql/queries';

export default function InvoiceListPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const queryVariables = useMemo<GetAllInvoicesVars>(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }), [pagination]);

  // Query to get the list of invoices
  const { data, loading, error } = useQuery<GetAllInvoicesData, GetAllInvoicesVars>(
    GET_ALL_INVOICES,
    { variables: queryVariables }
  );

  // Lazy query to fetch the secure URL on-demand (when a user clicks)
  const [getViewableUrl, { loading: urlLoading }] = useLazyQuery<GetViewableUrlData, GetViewableUrlVars>(
    GET_VIEWABLE_INVOICE_URL,
    {
      onCompleted: (data) => {
        if (data.getViewableInvoiceUrl) {
          // Success! Open the URL in a new tab.
          window.open(data.getViewableInvoiceUrl, '_blank');
        }
      },
      onError: (err) => {
        toast.error(`Could not get invoice URL: ${err.message}`);
      },
      // Important: prevent caching of secure URLs
      fetchPolicy: 'network-only',
    }
  );

  // Function to be called when the "View Invoice" button is clicked
  const viewInvoice = (invoiceId: string) => {
    toast.info('Generating secure link...');
    getViewableUrl({ variables: { invoiceId } });
  };

  const tableData = useMemo<InvoiceColumn[]>(() => {
    const invoices = data?.getAllInvoices.items ?? [];
    return invoices.map((invoice) => ({
      ...invoice,
      viewInvoice, // Inject the function into each row's data
    }));
  }, [data]);

  const pageCount = data ? Math.ceil(data.getAllInvoices.count / pagination.pageSize) : -1;

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
    return <div className='text-red-500'>Error: {error.message}</div>;
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
              <DataTableSkeleton rowCount={10} columnCount={5} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>{row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}</TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className='h-24 text-center'>No invoices found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && <DataTablePagination table={table} />}
    </div>
  );
}