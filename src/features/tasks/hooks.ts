'use client';

import { useCallback } from 'react';
import { Task } from './type';
import { useLocalStorage } from '@/hooks/uselocalstorage';
import { v4 as uuidv4 } from 'uuid'; // установим позже

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  // Создать новую задачу
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  }, [tasks, setTasks]);

  // Обновить задачу
  const updateTask = useCallback((id: string, updated: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
  }, [tasks, setTasks]);

  // Удалить задачу
  const deleteTask = useCallback((id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  }, [tasks, setTasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
}