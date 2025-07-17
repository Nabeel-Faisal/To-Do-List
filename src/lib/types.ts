export type TaskPriority = "High" | "Medium" | "Low";

export type TaskStatus = "Pending" | "Completed";

export type Task = {
  id: string;
  title: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedBy: string;
};

export type Employee = {
  name: string;
  photo: string;
  role: string;
  department: string;
};
