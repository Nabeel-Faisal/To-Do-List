
"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data for the chart
const data = [
  { name: 'Jan', Sales: 4000, Marketing: 2400, Engineering: 2400 },
  { name: 'Feb', Sales: 3000, Marketing: 1398, Engineering: 2210 },
  { name: 'Mar', Sales: 5000, Marketing: 9800, Engineering: 2290 },
  { name: 'Apr', Sales: 2780, Marketing: 3908, Engineering: 2000 },
  { name: 'May', Sales: 1890, Marketing: 4800, Engineering: 2181 },
  { name: 'Jun', Sales: 2390, Marketing: 3800, Engineering: 2500 },
];

export function AdminProductivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Analytics</CardTitle>
        <CardDescription>Performance trends by department over time.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value/1000}K`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="Sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Marketing" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Engineering" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
