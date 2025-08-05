'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDots, IconEdit } from '@tabler/icons-react';
import { Order, orderStatusEnum } from '../data/schema';
import { z } from 'zod';

// Extends the base Order type to include the function for opening the update dialog
export type OrderColumn = Order & {
  openUpdateDialog: (order: Order) => void;
};

// Helper function to get a badge color based on status
const getStatusVariant = (status: z.infer<typeof orderStatusEnum>) => {
  switch (status) {
    case 'RECEIVED':
      return 'default'; // Green
    case 'ORDERED':
      return 'secondary'; // Blue-ish
    case 'APPROVED':
      return 'outline'; // Yellow-ish/Orange-ish
    case 'PENDING':
      return 'destructive'; // Or any other color for pending
    default:
      return 'secondary';
  }
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'chemicalName',
    header: 'Chemical Name',
    cell: ({ row }) => <div className='font-medium'>{row.original.chemicalName}</div>
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
    cell: ({ row }) => <div>{row.original.vendor ?? 'N/A'}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status.replace(/_/g, ' ')}
      </Badge>
    )
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => <div>{`${row.original.quantity} ${row.original.unit}`}</div>
  },
  {
    accessorKey: 'created_at',
    header: 'Date Ordered',
    cell: ({ row }) => (
      <span>
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => order.openUpdateDialog(order)}>
              <IconEdit className='mr-2 h-4 w-4' />
              Update Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];