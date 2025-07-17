
"use client";

import * as React from "react";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { mockEmployee, allTasks } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = React.useState<Task[]>(allTasks.filter(t => t.assignedTo === 'Alex Doe' || t.assignedBy === 'Me'));
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleAddTask = (newTask: Omit<Task, 'id' | 'assignedBy' | 'status'>) => {
    const taskToAdd: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      assignedBy: "Me",
      status: "Pending",
    };
    allTasks.unshift(taskToAdd);
    setTasks([taskToAdd, ...tasks]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task
    ));
    // Also update the master list
    const taskInAll = allTasks.find(t => t.id === taskId);
    if (taskInAll) {
      taskInAll.status = taskInAll.status === 'Completed' ? 'Pending' : 'Completed';
    }
  };
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLogout = () => {
    router.push('/');
  };
  
  // This effect will re-filter tasks if the master list changes.
  React.useEffect(() => {
    setTasks(allTasks.filter(t => t.assignedTo === 'Alex Doe' || t.assignedBy === 'Me'));
  }, []); // Re-run when component mounts, but we need a better way to listen to changes in allTasks

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="size-8 text-primary shrink-0" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">TaskFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4">
            <EmployeeProfile employee={mockEmployee} />
          </div>
        </SidebarContent>
        <SidebarFooter>
           <div className="flex flex-col gap-2 w-full">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
          <AddTaskDialog onAddTask={handleAddTask} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" size="icon" className="h-10 w-10">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          <TaskOverview tasks={tasks} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-5 space-y-8">
              <TaskList tasks={filteredTasks} onToggleTask={toggleTaskCompletion} />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <ProductivityChart tasks={tasks} />
              <UpcomingDeadlines tasks={tasks} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
