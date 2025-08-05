'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Waste } from '../data/schema';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDots, IconHistory } from '@tabler/icons-react';

// This type adds the "view history" function to each row's data
export type WasteColumn = Waste & {
  viewHistory: (waste: Waste) => void;
};

export const columns: ColumnDef<WasteColumn>[] = [
  {
    accessorKey: 'name', // Using a generic key since the real data is in the version
    header: 'Waste Name',
    cell: ({ row }) => {
      // Get the name from the most recent version
      const latestVersion = row.original.versionHistory[0];
      return <div className='font-medium'>{latestVersion.chemicalWasteName}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const latestVersion = row.original.versionHistory[0];
      const status = latestVersion.status;
      return <Badge variant={status === 'DISPOSED' ? 'default' : 'secondary'}>{status.replace(/_/g, ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const latestVersion = row.original.versionHistory[0];
      return <span>{latestVersion.placementLocation}</span>;
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => <span>{new Date(row.original.updated_at).toLocaleDateString()}</span>,
  },
  {
    accessorKey: 'updatedBy',
    header: 'Updated By',
    cell: ({ row }) => <span>{row.original.updatedBy?.name ?? '-'}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const waste = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => waste.viewHistory(waste)}>
              <IconHistory className='mr-2 h-4 w-4' />
              View History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];