
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/lib/types";

type TaskMonitoringProps = {
  tasks: Task[];
};

export function TaskMonitoring({ tasks }: TaskMonitoringProps) {
  const [delayed, setDelayed] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const now = new Date();
    setDelayed(tasks.filter(t => new Date(t.deadline) < now && t.status !== 'Completed').length);
  }, [tasks]);

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'Pending').length; // Assuming pending is in-progress
  
  const highPriority = tasks.filter(t => t.priority === 'High' && t.status === 'Pending').length;
  const mediumPriority = tasks.filter(t => t.priority === 'Medium' && t.status === 'Pending').length;
  const lowPriority = tasks.filter(t => t.priority === 'Low' && t.status === 'Pending').length;

  const totalTasks = tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Monitoring</CardTitle>
        <CardDescription>Live overview of task distribution and status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Tasks by Status</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span>Completed</span>
                <span>{completed}/{totalTasks}</span>
              </div>
              <Progress value={totalTasks > 0 ? (completed / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-green-500"/>
            </div>
             <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span>In Progress</span>
                <span>{inProgress}/{totalTasks}</span>
              </div>
              <Progress value={totalTasks > 0 ? (inProgress / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-yellow-500"/>
            </div>
             <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span>Delayed</span>
                <span>{isClient ? delayed : '...'}/{totalTasks}</span>
              </div>
              <Progress value={totalTasks > 0 && isClient ? (delayed / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-red-500"/>
            </div>
          </div>
        </div>
         <div>
          <h4 className="text-sm font-medium mb-2">Pending Tasks by Priority</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>High</span><span>{highPriority}</span></div>
            <div className="flex justify-between"><span>Medium</span><span>{mediumPriority}</span></div>
            <div className="flex justify-between"><span>Low</span><span>{lowPriority}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
