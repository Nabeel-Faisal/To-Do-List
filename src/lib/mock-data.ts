
import type { Task, Employee, AppNotification, WorkSession } from './types';

// #region State Management
let listeners: (() => void)[] = [];
let stateInitialized = false;

let state = {
  tasks: [] as Task[],
  notifications: [] as AppNotification[],
  workSessions: [] as WorkSession[],
  employees: [] as Employee[],
};

// #region Employee Data
export const mockAdmin: Employee = {
  id: 'adm-001',
  username: 'admin',
  password: 'admin123',
  name: 'Admin User',
  photo: 'https://placehold.co/100x100.png',
  role: 'System Administrator',
  department: 'Administration',
};

const defaultEmployee: Employee = {
  id: 'emp-001',
  username: 'alexdoe',
  password: 'password123',
  name: 'Sample Employee',
  photo: 'https://placehold.co/100x100.png',
  role: 'Software Engineer',
  department: 'Technology',
  status: 'Active',
  lastLogin: new Date().toISOString(),
};

// This is the getter for all employees now.
export const allEmployees: Employee[] = state.employees;

// Function to safely get data from localStorage only on the client side
export const loadInitialData = () => {
  if (typeof window === 'undefined' || stateInitialized) {
    return;
  }
  try {
    const savedTasks = localStorage.getItem('tasks');
    const savedWorkSessions = localStorage.getItem('workSessions');
    const savedNotifications = localStorage.getItem('notifications');
    const savedEmployees = localStorage.getItem('employees');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      state.tasks = parsedTasks.map((t: any) => ({ ...t, deadline: new Date(t.deadline) }));
    } else {
      state.tasks = [];
    }

    state.workSessions = savedWorkSessions ? JSON.parse(savedWorkSessions) : [];
    state.notifications = savedNotifications ? JSON.parse(savedNotifications) : [];

    if (savedEmployees) {
        state.employees = JSON.parse(savedEmployees);
    } else {
        // If no employees, start with admin and one default employee
        state.employees = [mockAdmin, defaultEmployee];
    }
    
  } catch (e) {
    console.error("Failed to initialize state from localStorage", e);
    // If loading fails, initialize with default data
    state.tasks = [];
    state.workSessions = [];
    state.notifications = [];
    state.employees = [mockAdmin, defaultEmployee];
  } finally {
    stateInitialized = true;
    notify();
  }
};

// Function to safely save data to localStorage
const saveData = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('workSessions', JSON.stringify(state.workSessions));
    localStorage.setItem('notifications', JSON.stringify(state.notifications));
    localStorage.setItem('employees', JSON.stringify(state.employees));
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

// #region Authentication
export const authenticateUser = (username: string, password: string): { success: boolean, employee?: Employee } => {
    const user = state.employees.find(e => e.username === username && e.password === password);
    if (user) {
        return { success: true, employee: user };
    }
    return { success: false };
}

export const getCurrentEmployee = (): Employee | null => {
    if (typeof window === 'undefined') return null;
    const currentId = sessionStorage.getItem('currentEmployeeId');
    if (!currentId) return null;
    return state.employees.find(e => e.id === currentId) || null;
}
// #endregion

// #region Employee Management
export const addEmployee = (employeeData: Omit<Employee, 'id' | 'photo' | 'status' | 'username' | 'password'>): Employee => {
    const nameParts = employeeData.name.toLowerCase().split(' ');
    const username = nameParts.length > 1 
        ? `${nameParts[0]}${nameParts[nameParts.length - 1]}` 
        : nameParts[0];

    const password = Math.random().toString(36).slice(-8);

    const newEmployee: Employee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
        photo: 'https://placehold.co/100x100.png',
        status: 'Active',
        username,
        password,
    };
    state.employees.push(newEmployee);
    saveData();
    notify();
    return newEmployee;
}
// #endregion

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
  saveData();
  addNotification({
    id: `notif-${Date.now()}`,
    message: `New task assigned: "${newTask.title}" for ${newTask.assignedTo}`,
    read: false,
    recipient: newTask.assignedTo,
  });
  notify();
};

export const updateTask = (taskId: string, updates: Partial<Task>) => {
  state.tasks = state.tasks.map(task =>
    task.id === taskId ? { ...task, ...updates } : task
  );
  saveData();
  notify();
};
// #endregion

// #region Notifications
export const getNotifications = (): AppNotification[] => {
  const employee = getCurrentEmployee();
  if (!employee) return [];
  // Admins see all notifications, employees only see their own.
  if (employee.role === 'System Administrator') {
      return state.notifications;
  }
  return state.notifications.filter(n => n.recipient === employee.name);
};

export const addNotification = (notification: Omit<AppNotification, 'id'> & {id?: string}) => {
  const newNotification : AppNotification = {
      id: notification.id || `notif-${Date.now()}`,
      ...notification,
  }
  state.notifications = [newNotification, ...state.notifications];
  saveData();
  notify();
};

export const readAllNotifications = () => {
  const employee = getCurrentEmployee();
  if (!employee) return;
  
  state.notifications = state.notifications.map(n => 
    (n.recipient === employee.name ? { ...n, read: true } : n)
  );
  saveData();
  notify();
};
// #endregion

// #region Work Sessions
export const getWorkSessions = (): WorkSession[] => {
  return state.workSessions;
};

export const addWorkSession = (session: WorkSession) => {
    state.workSessions = [...state.workSessions, session];
    saveData();
    notify();
};

export const updateWorkSession = (sessionId: string, updates: Partial<WorkSession>) => {
    state.workSessions = state.workSessions.map(s => 
        s.id === sessionId ? { ...s, ...updates } : s
    );
    saveData();
    notify();
};
// #endregion
