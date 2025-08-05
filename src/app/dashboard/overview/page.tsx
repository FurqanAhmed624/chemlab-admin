import { DashboardClientPage } from "@/features/dashboard/components/dashboard-client-page";

export const metadata = {
  title: 'Dashboard: Overview'
};

/**
 * This is a Server Component that simply renders the Client Component
 * responsible for fetching and displaying the dashboard data.
 */
export default async function Page() {
  return <DashboardClientPage />;
}