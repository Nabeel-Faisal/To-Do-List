import type { Task, Employee } from './types';

export const mockEmployee: Employee = {
  name: 'Alex Doe',
  photo: 'https://placehold.co/100x100.png',
  role: 'Software Engineer',
  department: 'Technology',
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
