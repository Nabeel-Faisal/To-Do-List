
"use client";

import * as React from "react";
import { Bell, LogOut, Search, Settings, LayoutDashboard, Users, ClipboardCheck, BarChart2, Calendar, LifeBuoy } from "lucide-react";
import { useRouter } from 'next/navigation';

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
import { mockAdmin, mockEmployees, mockAdminTasks } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#', active: true },
    { name: 'Employees', icon: Users, href: '#' },
    { name: 'Tasks', icon: ClipboardCheck, href: '#' },
    { name: 'Analytics', icon: BarChart2, href: '#' },
    { name: 'Attendance', icon: Calendar, href: '#' },
  ];

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
                <SidebarMenuButton tooltip={item.name} isActive={item.active}>
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
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
           <Button variant="outline" size="icon" className="h-10 w-10">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          <AdminOverview employees={mockEmployees} tasks={mockAdminTasks} />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
             <div className="xl:col-span-2">
                <EmployeeManagement employees={mockEmployees} />
             </div>
             <div className="space-y-8">
                <TaskMonitoring tasks={mockAdminTasks} />
             </div>
          </div>
           <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
             <div className="xl:col-span-2">
                <AdminProductivityChart />
             </div>
             <div className="space-y-8">
                <AttendanceTracker employees={mockEmployees} />
             </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
