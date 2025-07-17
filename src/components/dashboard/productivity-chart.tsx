"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/lib/types";
import { format, subDays } from "date-fns";

type ProductivityChartProps = {
  tasks: Task[];
};

export function ProductivityChart({ tasks }: ProductivityChartProps) {
  const chartData = React.useMemo(() => {
    const data: { name: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayName = format(date, "EEE");
      const completedCount = tasks.filter(
        (task) =>
          task.status === "Completed" &&
          format(task.deadline, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ).length;
      data.push({ name: dayName, total: completedCount });
    }
    return data;
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Productivity</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
