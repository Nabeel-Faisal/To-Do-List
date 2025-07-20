
export type TaskPriority = "High" | "Medium" | "Low";

export type TaskStatus = "Pending" | "Completed";

export type Task = {
  id: string;
  title: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedBy: string;
  assignedTo?: string;
};

export type EmployeeStatus = "Active" | "On Leave" | "Inactive";

export type Employee = {
  id: string;
  name: string;
  photo: string;
  role: string;
  department: string;
  status?: EmployeeStatus;
  lastLogin?: string;
  username?: string;
  password?: string;
};

export type AppNotification = {
  id: string;
  message: string;
  read: boolean;
  recipient?: string;
};

export type WorkSessionStatus = 'Active' | 'Paused' | 'Completed';

export type WorkSession = {
    id: string;
    employeeId: string;
    employeeName: string;
    startTime: string;
    endTime: string | null;
    date: string;
    totalDuration: number; // in milliseconds
    status: WorkSessionStatus; 
};
