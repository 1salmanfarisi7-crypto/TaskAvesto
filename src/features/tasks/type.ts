export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'new' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}