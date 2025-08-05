'use client';

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityChartProps {
  data: {
    date: string; // "YYYY-MM"
    newlyAdded: number;
    updated: number;
  }[];
}

const formatMonth = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
};

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.map(item => ({ ...item, name: formatMonth(item.date) }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chemical Activity</CardTitle>
        <CardDescription>New and updated chemicals over the last 3 months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorNewlyAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUpdated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend iconSize={12} />
            <Area type="monotone" dataKey="newlyAdded" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorNewlyAdded)" name="Newly Added" />
            <Area type="monotone" dataKey="updated" stackId="1" stroke="hsl(var(--secondary))" fill="url(#colorUpdated)" name="Updated" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}