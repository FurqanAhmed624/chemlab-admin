import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import WasteListPage from '@/features/waste/components/waste-list-page';
// You would also create a DateFilter component for reuse
// import { DateFilter } from '@/components/ui/date-filter';

export const metadata = {
  title: 'Dashboard: Waste Management'
};

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Waste Management'
            description='Manage your lab’s chemical waste records and view version history.'
          />
          <div className='flex items-center space-x-2'>
            {/* <DateFilter /> */}
            <Link
              href='/dashboard/waste/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={1} />
          }
        >
          <WasteListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}