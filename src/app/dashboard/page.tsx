"use client";

import * as React from "react";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { EmployeeProfile } from "@/components/dashboard/employee-profile";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Logo } from "@/components/icons";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { TaskList } from "@/components/dashboard/task-list";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { AddTaskDialog } from "@/components/dashboard/add-task-dialog";
import { mockEmployee, mockTasks } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleAddTask = (newTask: Omit<Task, 'id' | 'assignedBy' | 'status'>) => {
    const taskToAdd: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      assignedBy: "Me",
      status: "Pending",
    };
    setTasks((prevTasks) => [taskToAdd, ...prevTasks]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task
    ));
  };
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-semibold">TaskFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <EmployeeProfile employee={mockEmployee} />
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
          <AddTaskDialog onAddTask={handleAddTask} />
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <TaskOverview tasks={tasks} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-5">
              <TaskList tasks={filteredTasks} onToggleTask={toggleTaskCompletion} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ProductivityChart tasks={tasks} />
              <UpcomingDeadlines tasks={tasks} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
