
import type { Task, Employee, AppNotification } from './types';

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

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design homepage UI',
    deadline: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-2',
    title: 'Develop API for user authentication',
    deadline: new Date(new Date().setDate(new Date().getDate() + 4)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-3',
    title: 'Fix bug in payment processing',
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 'Medium',
    status: 'Completed',
    assignedBy: 'John Doe',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-4',
    title: 'Write documentation for new feature',
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: 'Low',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-5',
    title: 'Team meeting for project planning',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'John Doe',
    assignedTo: 'Sample Employee',
  },
    {
    id: 'task-6',
    title: 'Update dependencies',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'Low',
    status: 'Completed',
    assignedBy: 'Tech Lead',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-7',
    title: 'Deploy to staging environment',
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Jane Smith',
    assignedTo: 'Sample Employee',
  },
  {
    id: 'task-8',
    title: 'Review Q3 budget',
    deadline: new Date(new Date().setDate(new Date().getDate() + 6)),
    priority: 'High',
    status: 'Pending',
    assignedBy: 'Admin User',
    assignedTo: 'Jane Smith',
  },
  {
    id: 'task-9',
    title: 'Onboard new hires',
    deadline: new Date(new Date().setDate(new Date().getDate() + 8)),
    priority: 'Medium',
    status: 'Pending',
    assignedBy: 'Admin User',
    assignedTo: 'Jane Smith',
  },
  {
    id: 'task-10',
    title: 'Finalize server migration plan',
    deadline: new Date(new Date().setDate(new Date().getDate() -1)),
    priority: 'High',
    status: 'Completed',
    assignedBy: 'Jane Smith',
    assignedTo: 'John Doe',
  }
].map(task => ({...task, deadline: new Date(task.deadline).toISOString()})); // Ensure dates are strings for serialization


// --- localStorage Persistence for Tasks ---
const TASKS_STORAGE_KEY = 'taskflow_tasks';

export const getInitialTasks = (): Task[] => {
  if (typeof window === 'undefined') {
    return initialTasks.map(task => ({...task, deadline: new Date(task.deadline)}));
  }
  try {
    const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      return JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        deadline: new Date(task.deadline),
      }));
    } else {
       window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialTasks));
       return initialTasks.map(task => ({...task, deadline: new Date(task.deadline)}));
    }
  } catch (error) {
    console.error("Failed to parse tasks from localStorage", error);
    return initialTasks.map(task => ({...task, deadline: new Date(task.deadline)}));
  }
};

export const saveTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  try {
    const tasksToStore = tasks.map(task => ({
        ...task,
        deadline: new Date(task.deadline).toISOString()
    }));
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToStore));
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error);
  }
};
// --- End of Task Persistence ---


// --- localStorage Persistence for Notifications ---
const NOTIFICATIONS_STORAGE_KEY = 'taskflow_notifications';

export const getNotifications = (): AppNotification[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to get notifications from localStorage", error);
        return [];
    }
}

export const addNotification = (notification: AppNotification) => {
    if (typeof window === 'undefined') return;
    const currentNotifications = getNotifications();
    const updatedNotifications = [notification, ...currentNotifications];
    try {
        window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Failed to save notifications to localStorage", error);
    }
}

export const markNotificationsAsRead = () => {
    if (typeof window === 'undefined') return;
    const currentNotifications = getNotifications();
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    try {
        window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Failed to mark notifications as read in localStorage", error);
    }
}
// --- End of Notification Persistence ---


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
