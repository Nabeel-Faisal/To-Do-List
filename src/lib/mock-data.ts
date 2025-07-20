
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

const initialTasksData: Omit<Task, 'deadline'> & { deadline: string }[] = [];

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
];
// #endregion

// Function to safely get data from localStorage only on the client side
// This should only be called once from a useEffect in a client component.
export const loadInitialData = () => {
  if (typeof window === 'undefined' || stateInitialized) {
    return;
  }
  try {
    // Clear old data for a fresh start
    localStorage.removeItem('tasks');
    localStorage.removeItem('workSessions');
    localStorage.removeItem('notifications');

    // For this request, we start fresh instead of loading.
    state.tasks = [];
    state.workSessions = [];
    state.notifications = [];
    
  } catch (e) {
    console.error("Failed to initialize state", e);
    // If loading fails, initialize with default data
    state.tasks = [];
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
  notify();
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
