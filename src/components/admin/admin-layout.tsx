
"use client";

import * as React from "react";
import { Bell, LogOut, Settings, LayoutDashboard, Users, ClipboardCheck, BarChart2, Calendar, History, UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

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
import {
  mockAdmin,
  getNotifications,
  subscribe,
  loadInitialData,
} from "@/lib/mock-data";
import type { AppNotification } from "@/lib/types";

type AdminLayoutProps = {
  children: React.ReactNode;
  activeTab: string;
};

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    loadInitialData();
    setIsClient(true);
    
    const handleUpdate = () => {
      setNotifications(getNotifications());
    };

    const unsubscribe = subscribe(handleUpdate);
    handleUpdate();

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (isClient) {
      // If there's a tab in the URL, go to the main page with that tab
      const tabFromUrl = searchParams.get('tab');
      if (tabFromUrl) {
        router.replace(`/admin?tab=${tabFromUrl}`);
      }
    }
  }, [isClient, router, searchParams]);


  const handleLogout = () => {
    router.push('/');
  };
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Employees', icon: Users, path: '/admin?tab=Employees' },
    { name: 'Add Employee', icon: UserPlus, path: '/admin/add-employee' },
    { name: 'Tasks', icon: ClipboardCheck, path: '/admin?tab=Tasks' },
    { name: 'Analytics', icon: BarChart2, path: '/admin?tab=Analytics' },
    { name: 'Attendance', icon: Calendar, path: '/admin?tab=Attendance' },
    { name: 'Work History', icon: History, path: '/admin?tab=Work History' },
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
                <SidebarMenuButton 
                  tooltip={item.name} 
                  isActive={activeTab === item.name}
                  onClick={() => router.push(item.path)}
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
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
