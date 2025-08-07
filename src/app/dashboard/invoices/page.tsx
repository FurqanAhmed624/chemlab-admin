import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import InvoiceListPage from '@/features/invoices/components/invoice-list-page';
import { Suspense } from 'react';
// You would also create an InvoiceUploader component and link to it.

export const metadata = {
  title: 'Dashboard: Invoices'
};

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Invoice Management'
            description='View and manage all uploaded invoices.'
          />
          {/* Link to a future page for uploading new invoices */}
          {/* <Link href='/dashboard/invoices/new'>Upload New</Link> */}
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}>
          <InvoiceListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}