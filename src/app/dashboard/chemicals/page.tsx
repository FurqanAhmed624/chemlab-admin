// src/app/dashboard/chemicals/page.tsx

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { IconPlus, IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import ChemicalListPage from '@/features/chemicals/components/chemical-list-page';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard: Chemical Inventory'
};


function DateFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <IconCalendar className='mr-2 h-4 w-4' />
          Filter by date
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Filter by update date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
        <DropdownMenuItem>Last 3 Days</DropdownMenuItem>
        <DropdownMenuItem>Last Week</DropdownMenuItem>
        <DropdownMenuItem>Last Month</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default async function Page() {
  // Your searchParams logic can be added back here when you connect to a real API
  // const searchParams = await props.searchParams;
  // searchParamsCache.parse(searchParams);
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Chemical Inventory'
            description='Manage your chemical inventory and view version history.'
          />
          <div className='flex items-center space-x-2'>
            <DateFilter />
            <Link
              href='/dashboard/chemicals/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={1} />
          }
        >
          <ChemicalListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}