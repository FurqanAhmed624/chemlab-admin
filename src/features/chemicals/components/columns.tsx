// src/features/chemicals/components/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Chemical, VersionHistory } from '../data/schema';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDots, IconHistory } from '@tabler/icons-react';

export type ChemicalColumn = Chemical & {
  viewHistory: (chemical: Chemical) => void;
};

// Helper function to get the correct badge variant for status
const getStatusVariant = (status: VersionHistory['status']) => {
  switch (status) {
    case 'IN_STOCK':
      return 'default';
    case 'LOW_STOCK':
      return 'secondary';
    case 'OUT_OF_STOCK':
    case 'REJECTED':
      return 'destructive';
    case 'PENDING_REVIEW':
      return 'outline';
    default:
      return 'secondary';
  }
};

// Helper to safely get the latest version (newest is first in the array)
const getLatestVersion = (row: any): VersionHistory | null => {
  return row.original.versionHistory?.[0] ?? null;
};


export const columns: ColumnDef<ChemicalColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const latest = getLatestVersion(row);
      return <div className='font-medium'>{latest?.name ?? 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const latest = getLatestVersion(row);
      if (!latest) return null;
      return (
        <Badge variant={getStatusVariant(latest.status)}>
          {latest.status.replace(/_/g, ' ')}
        </Badge>
      );
    }
  },
  // NEW: Column for Volume / Mass
  {
    accessorKey: 'volume',
    header: 'Volume / Mass',
    cell: ({ row }) => {
      const latest = getLatestVersion(row);
      if (!latest) return 'N/A';
      return <span>{`${latest.volumeOrMass} ${latest.unit}`}</span>;
    }
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const latest = getLatestVersion(row);
      return <span>{latest?.location ?? 'N/A'}</span>;
    }
  },
  // NEW: Column for Container Type
  {
    accessorKey: 'containerType',
    header: 'Container',
    cell: ({ row }) => {
      const latest = getLatestVersion(row);
      return <span>{latest?.containerType ?? 'N/A'}</span>;
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.original.updated_at).toLocaleDateString()}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const chemical = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => chemical.viewHistory(chemical)}>
              <IconHistory className='mr-2 h-4 w-4' />
              View History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];