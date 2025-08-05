'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChemicalStatusChartProps {
  stats: {
    totalChemicals: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

// Define the colors for our chart segments
const COLORS = {
  IN_STOCK: 'hsl(var(--chart-1))', // shadcn/ui chart colors
  LOW_STOCK: 'hsl(var(--chart-2))',
  OUT_OF_STOCK: 'hsl(var(--chart-3))',
};

export function ChemicalStatusChart({ stats }: ChemicalStatusChartProps) {
  // We derive the inStockCount from the other stats, as requested.
  const inStockCount = stats.totalChemicals - (stats.lowStockCount + stats.outOfStockCount);

  const data = [
    { name: 'In Stock', value: inStockCount, fill: COLORS.IN_STOCK },
    { name: 'Low Stock', value: stats.lowStockCount, fill: COLORS.LOW_STOCK },
    { name: 'Out of Stock', value: stats.outOfStockCount, fill: COLORS.OUT_OF_STOCK },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Breakdown of all chemicals by their current stock status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {/* Center Label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">
              {stats.totalChemicals}
            </text>
            <text x="50%" y="50%" dy="2em" textAnchor="middle" className="fill-muted-foreground text-sm">
              Total Chemicals
            </text>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}