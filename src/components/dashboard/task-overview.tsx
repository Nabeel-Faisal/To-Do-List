import type { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle2, AlertCircle, Zap } from "lucide-react";

type TaskOverviewProps = {
  tasks: Task[];
};

export function TaskOverview({ tasks }: TaskOverviewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const priorityTasks = tasks.filter((task) => task.priority === "High" && task.status === 'Pending').length;

  const overviewItems = [
    { title: "Total Tasks", value: totalTasks, icon: ListTodo, color: "text-primary" },
    { title: "Completed", value: completedTasks, icon: CheckCircle2, color: "text-green-500" },
    { title: "Pending", value: pendingTasks, icon: AlertCircle, color: "text-yellow-500" },
    { title: "High Priority", value: priorityTasks, icon: Zap, color: "text-red-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
