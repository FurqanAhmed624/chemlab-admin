'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RecentActivityListProps {
  chemicalActivity: { date: string; newlyAdded: number; updated: number }[];
  wasteActivity: { date: string; newlyCreated: number }[];
}

// Helper to get month name
const formatMonth = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
};

export function RecentActivityList({ chemicalActivity, wasteActivity }: RecentActivityListProps) {
  // We can just use the most recent month's data for this display.
  const latestChemMonth = chemicalActivity[chemicalActivity.length - 1];
  const latestWasteMonth = wasteActivity[wasteActivity.length - 1];
  const monthName = latestChemMonth ? formatMonth(latestChemMonth.date) : 'this month';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          A summary of lab activity for {monthName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">CH</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Chemical Updates</p>
            <p className="text-sm text-muted-foreground">{latestChemMonth?.updated || 0} chemicals were updated.</p>
          </div>
          <div className="ml-auto font-medium">+{latestChemMonth?.updated || 0}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">CN</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">New Chemicals Added</p>
            <p className="text-sm text-muted-foreground">{latestChemMonth?.newlyAdded || 0} new items inventoried.</p>
          </div>
          <div className="ml-auto font-medium">+{latestChemMonth?.newlyAdded || 0}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">WG</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Waste Generated</p>
            <p className="text-sm text-muted-foreground">{latestWasteMonth?.newlyCreated || 0} new waste records.</p>
          </div>
          <div className="ml-auto font-medium">+{latestWasteMonth?.newlyCreated || 0}</div>
        </div>
      </CardContent>
    </Card>
  );
}