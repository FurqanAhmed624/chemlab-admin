'use client'; // This is a Client Component

import { useQuery } from '@apollo/client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { StatCard } from './stat-card';
import { ActivityChart } from './activity-chart';
import { IconFlask, IconAlertTriangle, IconTrash, IconCheck } from '@tabler/icons-react';
import { GET_DASHBOARD_ANALYTICS, GetAnalyticsData } from '../graphql/queries';
import { WasteActivityChart } from './waste-activity-chart';
import { ChemicalStatusChart } from './chemical-status-chart';
import { RecentActivityList } from './recent-activity-list';
import PageContainer from '@/components/layout/page-container';

/**
 * A skeleton loader for the dashboard to show while data is fetching.
 */
function DashboardSkeleton() {
  return (
    <div className='flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6 animate-pulse'>
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-muted rounded-md" />
        <div className="h-4 w-1/2 bg-muted rounded-md" />
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 grid-cols-1">
        <div className="h-[400px] bg-muted rounded-lg" />
      </div>
    </div>
  );
}

/**
 * The main dashboard UI, responsible for its own data fetching.
 */
export function DashboardClientPage() {
  const { data, loading, error } = useQuery<GetAnalyticsData>(GET_DASHBOARD_ANALYTICS);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center space-y-4 p-4 md:p-8 pt-6'>
        <Heading
          title="Could not load dashboard"
          description="There was an error fetching the required data."
        />
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  // Extract the data for easier access
  const chemStats = data.getChemicalAnalytics.stats;
  const wasteStats = data.getWasteAnalytics.stats;
  const chemActivity = data.getChemicalAnalytics.activityLast3Months;
  const wasteActivity = data.getWasteAnalytics.activityLast3Months;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 p-2 pt-3'>
        <Heading
          title="Hi, Welcome back 👋"
          description='Here’s an overview of your lab’s inventory and activity.'
        />
        <Separator />

        {/* Stat Cards Grid (No changes needed here) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Chemicals"
            value={chemStats.totalChemicals.toLocaleString()}
            icon={<IconFlask className="h-4 w-4 text-muted-foreground" />}
            description="Total distinct chemicals in inventory"
          />
          <StatCard
            title="Low Stock"
            value={chemStats.lowStockCount.toLocaleString()}
            icon={<IconAlertTriangle className="h-4 w-4 text-muted-foreground" />}
            description="Chemicals that need reordering soon"
          />
          <StatCard
            title="Waste Pending Collection"
            value={wasteStats.pendingCollection.toLocaleString()}
            icon={<IconTrash className="h-4 w-4 text-muted-foreground" />}
            description="Waste records ready for pickup"
          />
          <StatCard
            title="Waste Disposed"
            value={wasteStats.disposedCount.toLocaleString()}
            icon={<IconCheck className="h-4 w-4 text-muted-foreground" />}
            description="Total waste records disposed"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChemicalStatusChart stats={chemStats} />
          </div>
          <div>
            <RecentActivityList chemicalActivity={chemActivity} wasteActivity={wasteActivity} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}