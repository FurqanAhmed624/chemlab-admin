// features/reports/components/columns.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDots, IconEdit } from '@tabler/icons-react';
import { ChemicalReport, reportStatusEnum } from '../data/schema';
import { z } from 'zod';

// Extends the base ChemicalReport type to include the function for opening the update dialog
export type ReportColumn = ChemicalReport & {
  openUpdateDialog: (report: ChemicalReport) => void;
};

// Helper function to get a badge color based on status
const getStatusVariant = (status: z.infer<typeof reportStatusEnum>) => {
  switch (status) {
    case 'RESOLVED':
      return 'default'; // Green
    case 'REVIEWED':
      return 'outline'; // Yellow-ish
    case 'PENDING':
      return 'destructive'; // Red
    default:
      return 'secondary';
  }
};

export const columns: ColumnDef<ReportColumn>[] = [
  {
    accessorKey: 'chemicalName',
    header: 'Chemical Name',
    cell: ({ row }) => <div className='font-medium'>{row.original.chemical.activeVersion.name}</div>
  },
  {
    accessorKey: 'user',
    header: 'Reported By',
    cell: ({ row }) => <div>{row.original.user.email}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status.charAt(0) + row.original.status.slice(1).toLowerCase()}
      </Badge>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Reported',
    cell: ({ row }) => (
      <span>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => report.openUpdateDialog(report)}>
              <IconEdit className='mr-2 h-4 w-4' />
              Update Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];