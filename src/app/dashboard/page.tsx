
"use client";

import * as React from "react";
import { Bell, LogOut, Search, Settings, LayoutDashboard, ClipboardCheck, BarChart2, Calendar, MessageSquare, HelpCircle, Plane } from "lucide-react";
import { useRouter } from 'next/navigation';
import { format as formatDate } from 'date-fns';

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
import { WorkHoursTimer } from "@/components/dashboard/work-hours-timer";
import {
  getTasks,
  updateTask,
  addWorkSession,
  updateWorkSession,
  getNotifications,
  readAllNotifications,
  subscribe,
  loadInitialData,
  getCurrentEmployee,
} from "@/lib/mock-data";
import type { Task, AppNotification, WorkSession, Employee } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const PlaceholderContent = ({ title, text }: { title: string, text: string }) => (
  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

type TimerState = {
    status: 'stopped' | 'running' | 'paused';
    startTime: number | null;
    accumulatedTime: number;
    sessionId: string | null;
}

const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const initialTimerState: TimerState = { status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null };

export default function DashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [allTasks, setAllTasks] = React.useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [timerState, setTimerState] = React.useState<TimerState>(initialTimerState);
  const [elapsedTime, setElapsedTime] = React.useState(formatTime(0));
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    loadInitialData();
    const currentEmployee = getCurrentEmployee();
    if (!currentEmployee) {
        router.push('/');
        return;
    }
    setEmployee(currentEmployee);
    setIsClient(true);

    const handleUpdate = () => {
      setAllTasks(getTasks());
      setNotifications(getNotifications());
    };
    const unsubscribe = subscribe(handleUpdate);
    handleUpdate();
    
    return () => unsubscribe();
  }, [router]);

  // Timer logic moved here
  const updateDisplay = React.useCallback(() => {
      let currentElapsedTime = timerState.accumulatedTime;
      if (timerState.status === 'running' && timerState.startTime) {
          currentElapsedTime += (new Date().getTime() - timerState.startTime);
      }
      setElapsedTime(formatTime(currentElapsedTime));
  }, [timerState.accumulatedTime, timerState.startTime, timerState.status]);

  React.useEffect(() => {
    if (timerState.status === 'running') {
      intervalRef.current = setInterval(updateDisplay, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      updateDisplay();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.status, updateDisplay]);
  
  const updateSession = (updates: Partial<WorkSession>) => {
    if (!timerState.sessionId) return;
    updateWorkSession(timerState.sessionId, updates);
  };

  const handleStartTimer = () => {
    if (!employee) return;
    const now = new Date();
    const newSessionId = `session-${now.getTime()}`;
    const newSession: WorkSession = {
      id: newSessionId,
      employeeId: employee.id,
      employeeName: employee.name,
      startTime: now.toISOString(),
      endTime: null,
      date: formatDate(now, 'yyyy-MM-dd'),
      totalDuration: 0,
      status: 'Active',
    };

    addWorkSession(newSession);
    setTimerState({ status: 'running', startTime: now.getTime(), accumulatedTime: 0, sessionId: newSessionId });
  };

  const handlePauseTimer = () => {
    if (timerState.status !== 'running' || !timerState.startTime) return;
    
    const now = new Date().getTime();
    const newAccumulatedTime = timerState.accumulatedTime + (now - timerState.startTime);

    updateSession({ status: 'Paused', totalDuration: newAccumulatedTime });
    setTimerState(prev => ({ ...prev, status: 'paused', accumulatedTime: newAccumulatedTime, startTime: null }));
  };

  const handleResumeTimer = () => {
    if (timerState.status !== 'paused') return;

    updateSession({ status: 'Active' });
    setTimerState(prev => ({ ...prev, status: 'running', startTime: new Date().getTime() }));
  };

  const handleStopTimer = () => {
    if (timerState.status === 'stopped' || !timerState.sessionId) return;
    
    const now = new Date();
    let finalAccumulatedTime = timerState.accumulatedTime;
    
    if (timerState.status === 'running' && timerState.startTime) {
      finalAccumulatedTime += (now.getTime() - timerState.startTime);
    }

    updateSession({ status: 'Completed', endTime: now.toISOString(), totalDuration: finalAccumulatedTime });
    setTimerState({ status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null });
  };


  const employeeTasks = allTasks.filter(t => t.assignedTo === employee?.name);

  const toggleTaskCompletion = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
    }
  };
  
  const filteredTasks = employeeTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('currentEmployeeId');
    }
    router.push('/');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    readAllNotifications();
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
     if (!isClient || !employee) {
        return <div className="p-8">Loading...</div>;
    }
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <TaskOverview tasks={employeeTasks} />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                 <ProductivityChart tasks={employeeTasks} />
              </div>
               <div className="space-y-8">
                <WorkHoursTimer
                  elapsedTime={elapsedTime}
                  status={timerState.status}
                  onStart={handleStartTimer}
                  onPause={handlePauseTimer}
                  onResume={handleResumeTimer}
                  onStop={handleStopTimer}
                />
                <UpcomingDeadlines tasks={employeeTasks} />
              </div>
            </div>
          </>
        );
      case 'My Tasks':
        return <TaskList tasks={filteredTasks} onToggleTask={toggleTaskCompletion} />;
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
           {employee && (
            <div className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4">
              <EmployeeProfile employee={employee} />
            </div>
           )}
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
          <div className="w-full flex-1 flex items-center justify-between">
             <h1 className="text-lg font-semibold md:text-2xl">{activeTab}</h1>
              {activeTab === 'My Tasks' && (
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
          </div>
          <DropdownMenu onOpenChange={(open) => { if (!open) handleNotificationClick() }}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground">
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
                   <DropdownMenuItem key={notif.id} className={`text-wrap ${!notif.read ? 'font-bold' : ''}`}>
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
