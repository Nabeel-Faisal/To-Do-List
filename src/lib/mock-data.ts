
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

export const initialTasks: Task[] = [
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
  // This function now ONLY returns the default tasks and does NOT interact with localStorage.
  // This prevents hydration errors by ensuring server and client get the same initial data.
  // The actual loading from localStorage is now handled in the component's useEffect.
  return initialTasks.map(task => ({
    ...task,
    deadline: new Date(task.deadline),
  }));
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


// --- localStorage Persistence for Work Sessions ---
const WORK_SESSIONS_STORAGE_KEY = 'taskflow_work_sessions';
const TIMER_STATE_STORAGE_KEY = 'taskflow_timer_state';

export type TimerState = {
    status: 'stopped' | 'running' | 'paused';
    startTime: string | null; // The time the current interval started
    accumulatedTime: number; // Time in ms accumulated before the current interval
    sessionId: string | null;
}

export const getWorkSessions = (): WorkSession[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = window.localStorage.getItem(WORK_SESSIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to get work sessions from localStorage", error);
        return [];
    }
};

export const saveWorkSessions = (sessions: WorkSession[]) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(WORK_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error("Failed to save work sessions to localStorage", error);
    }
};

export const getTimerState = (): TimerState => {
    if (typeof window === 'undefined') return { status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null };
    try {
        const stored = window.localStorage.getItem(TIMER_STATE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null };
    } catch (error) {
        console.error("Failed to get timer state from localStorage", error);
        return { status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null };
    }
};

export const saveTimerState = (state: TimerState) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(TIMER_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save timer state to localStorage", error);
    }
};
// --- End of Work Session Persistence ---
