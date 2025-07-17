"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type UpcomingDeadlinesProps = {
  tasks: Task[];
};

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const deadlines = React.useMemo(() => tasks.map(task => task.deadline), [tasks]);

  const tasksForSelectedDate = React.useMemo(() => {
    if (!date) return [];
    return tasks.filter(
      (task) =>
        task.deadline.getFullYear() === date.getFullYear() &&
        task.deadline.getMonth() === date.getMonth() &&
        task.deadline.getDate() === date.getDate()
    );
  }, [date, tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          modifiers={{ deadlines: deadlines }}
          modifiersStyles={{
            deadlines: {
                color: 'hsl(var(--accent-foreground))',
                backgroundColor: 'hsl(var(--accent))',
            }
          }}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
          }}
        />
        <div className="w-full mt-4 space-y-2">
            <h4 className="font-medium">
                Tasks for {date ? date.toLocaleDateString() : 'selected date'}:
            </h4>
            {tasksForSelectedDate.length > 0 ? (
                <ul className="space-y-2">
                {tasksForSelectedDate.map(task => (
                    <li key={task.id} className="text-sm p-2 rounded-md bg-muted/50 flex justify-between items-center">
                        <span>{task.title}</span>
                        <Badge variant={
                            task.priority === 'High' ? 'destructive' :
                            task.priority === 'Medium' ? 'secondary' : 'outline'
                        }>{task.priority}</Badge>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks due on this day.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
