
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
};
