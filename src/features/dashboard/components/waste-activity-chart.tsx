'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface WasteActivityChartProps {
  data: {
    date: string; // "YYYY-MM"
    newlyCreated: number;
  }[];
}

const formatMonth = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
};

export function WasteActivityChart({ data }: WasteActivityChartProps) {
  const chartData = data.map(item => ({ ...item, name: formatMonth(item.date) }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Generation</CardTitle>
        <CardDescription>New waste records created over the last 3 months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend iconSize={12} />
            <Line type="monotone" dataKey="newlyCreated" stroke="hsl(var(--primary))" strokeWidth={2} name="New Records" dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}