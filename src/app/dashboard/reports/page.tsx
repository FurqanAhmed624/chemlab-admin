// app/dashboard/reports/page.tsx

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ReportListPage from '@/features/reports/components/report-list-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Chemical Reports'
};

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Chemical Reports'
            description='Review and manage chemical reports from users.'
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={10} />
          }
        >
          <ReportListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}