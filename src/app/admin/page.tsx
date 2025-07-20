
"use client";

import * as React from "react";
import { Bell, LogOut, Settings, LayoutDashboard, Users, ClipboardCheck, BarChart2, Calendar, History, PlusCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Logo } from "@/components/icons";
import { AdminProfile } from "@/components/admin/admin-profile";
import { AdminOverview } from "@/components/admin/admin-overview";
import { EmployeeManagement } from "@/components/admin/employee-management";
import { TaskMonitoring } from "@/components/admin/task-monitoring";
import { AdminProductivityChart } from "@/components/admin/admin-productivity-chart";
import { AttendanceTracker } from "@/components/admin/attendance-tracker";
import { AssignTaskDialog } from "@/components/admin/assign-task-dialog";
import { WorkHoursHistory } from "@/components/admin/work-hours-history";
import {
  allEmployees,
  mockAdmin,
  addTask,
  getTasks,
  getNotifications,
  getWorkSessions,
  subscribe,
  loadInitialData,
} from "@/lib/mock-data";
import type { Task, Employee, AppNotification, WorkSession } from "@/lib/types";


export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [employees] = React.useState<Employee[]>(allEmployees);
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [workSessions, setWorkSessions] = React.useState<WorkSession[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    loadInitialData();
    setIsClient(true);
    
    const handleUpdate = () => {
      setTasks(getTasks());
      setNotifications(getNotifications());
      setWorkSessions(getWorkSessions());
    };

    const unsubscribe = subscribe(handleUpdate);
    handleUpdate();

    return () => unsubscribe();
  }, []);


  const handleLogout = () => {
    router.push('/');
  };

  const handleAssignTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    addTask(newTask);
  };
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Employees', icon: Users },
    { name: 'Tasks', icon: ClipboardCheck },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Attendance', icon: Calendar },
    { name: 'Work History', icon: History },
  ];

  const renderContent = () => {
    if (!isClient) {
        return <div className="p-8">Loading...</div>;
    }
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <AdminOverview employees={employees} tasks={tasks} />
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                  <AdminProductivityChart />
              </div>
              <div className="space-y-8">
                  <TaskMonitoring tasks={tasks} />
              </div>
            </div>
             <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <EmployeeManagement employees={employees} />
                </div>
                <div className="space-y-8">
                  <AttendanceTracker employees={employees} />
                </div>
            </div>
          </>
        );
      case 'Employees':
        return <EmployeeManagement employees={employees} />;
      case 'Tasks':
        return <TaskMonitoring tasks={tasks} />;
      case 'Analytics':
        return <AdminProductivityChart />;
      case 'Attendance':
        return <AttendanceTracker employees={employees} />;
      case 'Work History':
        return <WorkHoursHistory sessions={workSessions} />;
      default:
        return <AdminOverview employees={employees} tasks={tasks} />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="size-8 text-primary shrink-0" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">TaskFlow Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  tooltip={item.name} 
                  isActive={activeTab === item.name}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <AdminProfile admin={mockAdmin} />
           <div className="flex flex-col gap-2 w-full p-4">
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
          <div className="w-full flex-1 flex items-center justify-between">
             <h1 className="text-lg font-semibold md:text-2xl">{activeTab}</h1>
             {activeTab === 'Tasks' && (
                <div className="flex items-center justify-end">
                    <AssignTaskDialog onAssignTask={handleAssignTask} />
                </div>
            )}
          </div>
          <div className="flex items-center gap-4">
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
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <DropdownMenuItem key={notif.id}>{notif.message}</DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
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
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Manage Users</DropdownMenuItem>
                <DropdownMenuItem>System</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
