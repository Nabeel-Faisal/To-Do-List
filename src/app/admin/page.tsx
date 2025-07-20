
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminOverview } from "@/components/admin/admin-overview";
import { EmployeeManagement } from "@/components/admin/employee-management";
import { TaskMonitoring } from "@/components/admin/task-monitoring";
import { AdminProductivityChart } from "@/components/admin/admin-productivity-chart";
import { AttendanceTracker } from "@/components/admin/attendance-tracker";
import { AssignTaskDialog } from "@/components/admin/assign-task-dialog";
import { WorkHoursHistory } from "@/components/admin/work-hours-history";
import {
  allEmployees,
  addTask,
  getTasks,
  getWorkSessions,
  subscribe,
  loadInitialData,
} from "@/lib/mock-data";
import type { Task, Employee, WorkSession } from "@/lib/types";


export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [workSessions, setWorkSessions] = React.useState<WorkSession[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  const activeTab = searchParams.get('tab') || 'Dashboard';
  
  React.useEffect(() => {
    loadInitialData();
    setIsClient(true);
    
    const handleUpdate = () => {
      setTasks(getTasks());
      setWorkSessions(getWorkSessions());
      setEmployees(allEmployees);
    };

    const unsubscribe = subscribe(handleUpdate);
    handleUpdate();

    return () => unsubscribe();
  }, []);

  const handleAssignTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    addTask(newTask);
  };

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
    <AdminLayout activeTab={activeTab}>
      <div className="w-full flex-1 flex items-center justify-end">
          {activeTab === 'Tasks' && (
            <AssignTaskDialog onAssignTask={handleAssignTask} employees={employees}/>
          )}
      </div>
      <div className="space-y-8">
        {renderContent()}
      </div>
    </AdminLayout>
  );
}
