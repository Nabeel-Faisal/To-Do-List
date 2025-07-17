
"use client";

import * as React from "react";
import { Bell, LogOut, Search, Settings } from "lucide-react";
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-semibold">TaskFlow Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <AdminProfile admin={mockAdmin} />
        </SidebarContent>
        <SidebarFooter className="flex-col !items-start p-2 gap-2">
           <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
           <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <AdminOverview employees={mockEmployees} tasks={mockAdminTasks} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
             <div className="xl:col-span-2">
                <EmployeeManagement employees={mockEmployees} />
             </div>
             <div className="space-y-6">
                <TaskMonitoring tasks={mockAdminTasks} />
             </div>
          </div>
           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
             <div className="xl:col-span-2">
                <AdminProductivityChart />
             </div>
             <div className="space-y-6">
                <AttendanceTracker employees={mockEmployees} />
             </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
