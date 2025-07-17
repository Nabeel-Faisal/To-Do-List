
"use client";

import * as React from "react";
import { Bell, LogOut, Search, Settings, LayoutDashboard, Users, ClipboardCheck, BarChart2, Calendar, MessageSquare, HelpCircle, Plane } from "lucide-react";
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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { EmployeeProfile } from "@/components/dashboard/employee-profile";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Logo } from "@/components/icons";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { TaskList } from "@/components/dashboard/task-list";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { mockEmployee, allTasks, allNotifications, markNotificationsAsRead } from "@/lib/mock-data";
import type { Task, AppNotification } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const PlaceholderContent = ({ title, text }: { title: string, text: string }) => (
  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [notifications, setNotifications] = React.useState<AppNotification[]>(allNotifications);
  const [activeTab, setActiveTab] = React.useState('Dashboard');

  React.useEffect(() => {
    setTasks(allTasks.filter(t => t.assignedTo === 'Alex Doe'));
    setNotifications(allNotifications);
  }, [activeTab]);

  const toggleTaskCompletion = (taskId: string) => {
    const taskInAll = allTasks.find(t => t.id === taskId);
    if (taskInAll) {
      taskInAll.status = taskInAll.status === 'Completed' ? 'Pending' : 'Completed';
    }
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task
    ));
  };
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLogout = () => {
    router.push('/');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    markNotificationsAsRead();
    setNotifications([...allNotifications]);
  };
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', icon: ClipboardCheck },
    { name: 'Attendance', icon: Calendar },
    { name: 'Leave Requests', icon: Plane },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Reports', icon: BarChart2 },
    { name: 'Settings', icon: Settings },
    { name: 'Help Center', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
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
          </>
        );
      case 'My Tasks':
        return <PlaceholderContent title="My Tasks" text="Here you'll see your assigned tasks. Task management coming soon." />;
      case 'Attendance':
        return <PlaceholderContent title="Attendance" text="Your attendance record will appear here. Tracking feature launching soon." />;
      case 'Leave Requests':
        return <PlaceholderContent title="Leave Requests" text="Submit and track your leave requests here. Coming soon." />;
      case 'Messages':
        return <PlaceholderContent title="Messages" text="Stay connected with your team. Messaging feature coming soon." />;
      case 'Reports':
        return <PlaceholderContent title="Reports" text="Access your performance and activity reports. Feature under development." />;
      case 'Settings':
        return <PlaceholderContent title="Settings" text="Customize your preferences here. Settings page coming soon." />;
      case 'Help Center':
        return <PlaceholderContent title="Help Center" text="Need assistance? Help resources will be available here soon." />;
      default:
        return <PlaceholderContent title="Coming Soon" text="This feature is under development." />;
    }
  };

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
           <div className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4">
             <EmployeeProfile employee={mockEmployee} />
           </div>
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
             <h1 className="text-lg font-semibold md:text-2xl">{activeTab}</h1>
          </div>
          <DropdownMenu onOpenChange={(open) => open && handleNotificationClick()}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center bg-red-500 text-white">
                    {unreadNotificationCount}
                  </Badge>
                )}
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map(notif => (
                   <DropdownMenuItem key={notif.id} className={`text-wrap ${notif.read ? '' : 'font-bold'}`}>
                    {notif.message}
                  </DropdownMenuItem>
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-8 space-y-8">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
