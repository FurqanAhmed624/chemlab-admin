'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDots, IconFileDownload } from '@tabler/icons-react';
import { Invoice } from '../data/schema';

// Extend the base Invoice type to include the action function
export type InvoiceColumn = Invoice & {
  viewInvoice: (invoiceId: string) => void;
};

export const columns: ColumnDef<InvoiceColumn>[] = [
  {
    accessorKey: 'originalFilename',
    header: 'Filename',
    cell: ({ row }) => <div className='font-medium'>{row.original.originalFilename}</div>,
  },
  {
    accessorKey: 'referenceText',
    header: 'Reference',
    cell: ({ row }) => <div>{row.original.referenceText ?? 'N/A'}</div>,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => <div className="truncate max-w-xs">{row.original.notes ?? 'N/A'}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Upload Date',
    cell: ({ row }) => {
      const timestamp = parseInt(String(row.original.createdAt), 10);

      return <span>{new Date(timestamp).toLocaleDateString()}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => invoice.viewInvoice(invoice.id)}>
              <IconFileDownload className='mr-2 h-4 w-4' />
              View / Download Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];