
import type { Task, Employee } from './types';

export const mockEmployee: Employee = {
  id: 'emp-001',
  name: 'Alex Doe',
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

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design homepage UI',
    deadline: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
  },
  {
    id: 'task-2',
    title: 'Develop API for user authentication',
    deadline: new Date(new Date().setDate(new Date().getDate() + 4)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
  },
  {
    id: 'task-3',
    title: 'Fix bug in payment processing',
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 'Medium',
    status: 'Completed',
    assignedBy: 'John Doe',
  },
  {
    id: 'task-4',
    title: 'Write documentation for new feature',
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: 'Low',
    status: 'Pending',
    assignedBy: 'Jane Smith',
  },
  {
    id: 'task-5',
    title: 'Team meeting for project planning',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'John Doe',
  },
    {
    id: 'task-6',
    title: 'Update dependencies',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'Low',
    status: 'Completed',
    assignedBy: 'Tech Lead',
  },
  {
    id: 'task-7',
    title: 'Deploy to staging environment',
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
  },
];

export const mockEmployees: Employee[] = [
  { ...mockEmployee },
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

export const mockAdminTasks: Task[] = [
  ...mockTasks,
  {
    id: 'task-8',
    title: 'Review Q3 budget',
    deadline: new Date(new Date().setDate(new Date().getDate() + 6)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Admin User',
  },
  {
    id: 'task-9',
    title: 'Onboard new hires',
    deadline: new Date(new Date().setDate(new Date().getDate() + 8)),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'Admin User',
  },
  {
    id: 'task-10',
    title: 'Finalize server migration plan',
    deadline: new Date(new Date().setDate(new Date().getDate() -1)),
    priority: 'High',
    status: 'Completed',
    assignedBy: 'Jane Smith'
  }
];
