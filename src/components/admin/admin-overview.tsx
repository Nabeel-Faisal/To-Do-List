
"use client";

import * as React from "react";
import type { Task, Employee } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, Building, CalendarCheck } from "lucide-react";

type AdminOverviewProps = {
  employees: Employee[];
  tasks: Task[];
};

export function AdminOverview({ employees, tasks }: AdminOverviewProps) {
  const [completedToday, setCompletedToday] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const todayString = new Date().toDateString();
    setCompletedToday(tasks.filter(task => task.status === 'Completed' && new Date(task.deadline).toDateString() === todayString).length);
  }, [tasks]);

  const totalEmployees = employees.length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const departments = new Set(employees.map(e => e.department)).size;
  const attendanceToday = Math.floor(totalEmployees * 0.9) || 0;

  const overviewItems = [
    { title: "Total Employees", value: totalEmployees, icon: Users, color: "text-blue-500" },
    { title: "Tasks Completed Today", value: isClient ? completedToday : '...', icon: CheckCircle, color: "text-green-500" },
    { title: "All Pending Tasks", value: pendingTasks, icon: Clock, color: "text-yellow-500" },
    { title: "Departments", value: departments, icon: Building, color: "text-indigo-500" },
    { title: "Attendance Today", value: `${attendanceToday}/${totalEmployees}`, icon: CalendarCheck, color: "text-purple-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {overviewItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
