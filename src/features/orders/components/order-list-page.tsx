'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

import { Order, orderStatusEnum } from '../data/schema';
import { OrderColumn, columns } from './columns';
import { GET_ALL_ORDERS, UPDATE_ORDER_STATUS, GetAllOrdersData, GetAllOrdersVars, UpdateOrderData, UpdateOrderVars } from '../graphql/queries';

// =======================================================================
// === Update Status Dialog Component ===
// =======================================================================
function UpdateStatusDialog({
                              order,
                              onClose,
                              onUpdate,
                              loading
                            }: {
  order: Order | null;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
  loading: boolean;
}) {
  const [newStatus, setNewStatus] = useState<string>(order?.status || '');

  if (!order) return null;

  const handleSubmit = () => {
    onUpdate(order.id, newStatus);
  };

  return (
    <Dialog open={!!order} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for the order of "{order.chemicalName}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select a new status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatusEnum.options.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || newStatus === order.status}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function OrderListPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);

  const queryVariables = useMemo<GetAllOrdersVars>(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }), [pagination]);

  const { data, loading, error, refetch } = useQuery<GetAllOrdersData, GetAllOrdersVars>(
    GET_ALL_ORDERS,
    { variables: queryVariables }
  );

  const [updateOrder, { loading: updateLoading }] = useMutation<UpdateOrderData, UpdateOrderVars>(
    UPDATE_ORDER_STATUS,
    {
      onCompleted: () => {
        toast.success('Order status updated successfully!');
        refetch(); // Refetch the list to show the new status
        setOrderToUpdate(null); // Close the dialog
      },
      onError: (err) => {
        toast.error(`Failed to update order: ${err.message}`);
      }
    }
  );

  const handleUpdate = (id: string, status: string) => {
    updateOrder({ variables: { input: { id, status } } });
  };

  const openUpdateDialog = (order: Order) => {
    setOrderToUpdate(order);
  };

  const tableData = useMemo<OrderColumn[]>(() => {
    const orders = data?.getAllOrders.items ?? [];
    return orders.map((order) => ({
      ...order,
      openUpdateDialog, // Inject the function into each row's data
    }));
  }, [data]);

  const pageCount = data ? Math.ceil(data.getAllOrders.count / pagination.pageSize) : -1;

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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(pagination.pageSize)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col, j) => (
                    <TableCell key={`skeleton-cell-${j}`}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && <DataTablePagination table={table} />}

      <UpdateStatusDialog
        order={orderToUpdate}
        onClose={() => setOrderToUpdate(null)}
        onUpdate={handleUpdate}
        loading={updateLoading}
      />
    </div>
  );
}