
import type { Task, Employee, AppNotification, WorkSession } from './types';

export const mockEmployee: Employee = {
  id: 'emp-001',
  name: 'Sample Employee',
  photo: 'https://placehold.co/100x100.png',
  role: 'Software Engineer',
  department: 'Technology',
  status: 'Active',
  lastLogin: new Date().toISOString(),
};

export const mockAdmin: Employee = {
  id: 'adm-001',
  name: 'Admin User',
  photo: 'https://placehold.co/100x100.png',
  role: 'System Administrator',
  department: 'Administration',
};

const initialTasksData: Omit<Task, 'deadline'> & { deadline: string }[] = [
  {
    id: 'task-1',
    title: 'Design homepage UI',
    deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-2',
    title: 'Develop API for user authentication',
    deadline: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-3',
    title: 'Fix bug in payment processing',
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    priority: 'Medium',
    status: 'Completed',
    assignedBy: 'John Doe',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-4',
    title: 'Write documentation for new feature',
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    priority: 'Low',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-5',
    title: 'Team meeting for project planning',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'John Doe',
    assignedTo: 'Sample Employee',
  },
    {
    id: 'task-6',
    title: 'Update dependencies',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    priority: 'Low',
    status: 'Completed',
    assignedBy: 'Tech Lead',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-7',
    title: 'Deploy to staging environment',
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-8',
    title: 'Review Q3 budget',
    deadline: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Admin User',
    assignedTo: 'Jane Smith',
  },
  {
    id: 'task-9',
    title: 'Onboard new hires',
    deadline: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'Admin User',
    assignedTo: 'Jane Smith',
  },
  {
    id: 'task-10',
    title: 'Finalize server migration plan',
    deadline: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(),
    priority: 'High',
    status: 'Completed',
    assignedBy: 'Jane Smith',
    assignedTo: 'John Doe',
  }
];

export const getInitialTasks = (): Task[] => {
  return initialTasksData.map(task => ({
    ...task,
    deadline: new Date(task.deadline),
  }));
};

export const allEmployees: Employee[] = [
  // The first employee is our sample employee. We change the name but keep the ID for assignments.
  { ...mockEmployee, id: 'emp-001', name: 'Sample Employee' }, 
  {
    id: 'emp-002',
    name: 'Jane Smith',
    photo: 'https://placehold.co/100x100.png',
    role: 'Project Manager',
    department: 'Management',
    status: 'Active',
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: 'emp-003',
    name: 'John Doe',
    photo: 'https://placehold.co/100x100.png',
    role: 'Lead Designer',
    department: 'Design',
    status: 'On Leave',
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: 'emp-004',
    name: 'Emily White',
    photo: 'https://placehold.co/100x100.png',
    role: 'Marketing Specialist',
    department: 'Marketing',
    status: 'Active',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'emp-005',
    name: 'Michael Brown',
    photo: 'https://placehold.co/100x100.png',
    role: 'QA Tester',
    department: 'Technology',
    status: 'Inactive',
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
  },
];

// In-memory data for work sessions
let workSessions: WorkSession[] = [];

export const getWorkSessions = (): WorkSession[] => {
    return workSessions;
};

export const setWorkSessions = (sessions: WorkSession[]) => {
    workSessions = sessions;
};
