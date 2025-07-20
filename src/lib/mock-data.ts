
import type { Task, Employee, AppNotification, WorkSession } from './types';

// #region State Management
// Simple in-memory store and a pub/sub mechanism to notify components of changes.
let listeners: (() => void)[] = [];
let stateInitialized = false;

let state = {
  tasks: [] as Task[],
  notifications: [] as AppNotification[],
  workSessions: [] as WorkSession[],
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

// #region Employee Data
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

export const allEmployees: Employee[] = [
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
// #endregion

// #endregion

// Function to safely get data from localStorage only on the client side
// This should only be called once from a useEffect in a client component.
export const loadInitialData = () => {
  if (typeof window === 'undefined' || stateInitialized) {
    return;
  }
  try {
    const serializedTasks = localStorage.getItem('tasks');
    const serializedWorkSessions = localStorage.getItem('workSessions');
    const serializedNotifications = localStorage.getItem('notifications');

    if (serializedTasks) {
      const parsedTasks = JSON.parse(serializedTasks);
      state.tasks = parsedTasks.map((t: any) => ({ ...t, deadline: new Date(t.deadline) }));
    } else {
       state.tasks = initialTasksData.map(task => ({
        ...task,
        deadline: new Date(task.deadline),
      }));
    }

    if (serializedWorkSessions) {
      state.workSessions = JSON.parse(serializedWorkSessions);
    }

    if (serializedNotifications) {
        state.notifications = JSON.parse(serializedNotifications);
    } else {
      state.notifications = [];
    }
    
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
    // If loading fails, initialize with default data
    state.tasks = initialTasksData.map(task => ({
      ...task,
      deadline: new Date(task.deadline),
    }));
    state.workSessions = [];
    state.notifications = [];
  } finally {
    stateInitialized = true;
    notify();
  }
};

// Function to safely save data to localStorage
const saveTasks = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }
};

const saveWorkSessions = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('workSessions', JSON.stringify(state.workSessions));
    }
};

const saveNotifications = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
    }
};

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return function unsubscribe() {
    listeners = listeners.filter(l => l !== listener);
  };
}

function notify() {
  listeners.forEach(listener => listener());
}

// #region Tasks
export const getTasks = (): Task[] => {
  return state.tasks;
};

export const addTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
  const newTask: Task = {
    ...newTaskData,
    id: `task-${Date.now()}`,
    status: "Pending",
  };
  state.tasks = [newTask, ...state.tasks];
  saveTasks();
  addNotification({
    id: `notif-${Date.now()}`,
    message: `New task assigned: "${newTask.title}"`,
    read: false,
  });
  notify();
};

export const updateTask = (taskId: string, updates: Partial<Task>) => {
  state.tasks = state.tasks.map(task =>
    task.id === taskId ? { ...task, ...updates } : task
  );
  saveTasks();
  notify();
};

// #endregion

// #region Notifications
export const getNotifications = (): AppNotification[] => {
  return state.notifications;
};

export const addNotification = (notification: AppNotification) => {
  state.notifications = [notification, ...state.notifications];
  saveNotifications();
};

export const readAllNotifications = () => {
  state.notifications = state.notifications.map(n => ({ ...n, read: true }));
  saveNotifications();
  notify();
};
// #endregion

// #region Work Sessions
export const getWorkSessions = (): WorkSession[] => {
  return state.workSessions;
};

export const addWorkSession = (session: WorkSession) => {
    state.workSessions = [...state.workSessions, session];
    saveWorkSessions();
    notify();
};

export const updateWorkSession = (sessionId: string, updates: Partial<WorkSession>) => {
    state.workSessions = state.workSessions.map(s => 
        s.id === sessionId ? { ...s, ...updates } : s
    );
    saveWorkSessions();
    notify();
};
// #endregion
