import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  const trendIcon = trend?.direction === 'up' ? <IconTrendingUp className="h-4 w-4 text-emerald-500" />
    : trend?.direction === 'down' ? <IconTrendingDown className="h-4 w-4 text-red-500" /> : null;

  const trendColor = trend?.direction === 'up' ? 'text-emerald-500' :
    trend?.direction === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trendIcon}
            <span className={cn("font-medium", trendColor)}>{trend.value}</span>
            <span>vs. last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}