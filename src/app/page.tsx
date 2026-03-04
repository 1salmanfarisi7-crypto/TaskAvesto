'use client';

import { useTasks } from '@/features/tasks/hooks';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { TaskStatus, TaskPriority } from '@/features/tasks/type';
import { useDebounce } from '@/hooks/usedebounce';
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard';
import './Home.css'; 
import ThemeToggle from '@/components/ThemeToggle';
export default function Home() {
  const { tasks } = useTasks();

  const [sortField, setSortField] = useState<'createdAt' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter(task => {
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      const searchMatch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      return statusMatch && priorityMatch && searchMatch;
    });

    return result.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortField === 'priority') {
        const priorityMap = { low: 1, medium: 2, high: 3 };
        return sortOrder === 'asc'
          ? priorityMap[a.priority] - priorityMap[b.priority]
          : priorityMap[b.priority] - priorityMap[a.priority];
      }
      return 0;
    });
  }, [tasks, statusFilter, priorityFilter, debouncedSearch, sortField, sortOrder]);

  return (
    <main className="main-container">
      <ThemeToggle />
      <div className="header">
        <h1>Task Manager</h1>
        <Link href="/tasks">
          <button className="create-task-btn">Создать задачу</button>
        </Link>
      </div>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}>
          <option value="all">Все статусы</option>
          <option value="new">Новая</option>
          <option value="in-progress">В работе</option>
          <option value="done">Завершена</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}>
          <option value="all">Все приоритеты</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        <input
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sorting">
        <select value={sortField} onChange={(e) => setSortField(e.target.value as 'createdAt' | 'priority')}>
          <option value="createdAt">По дате создания</option>
          <option value="priority">По приоритету</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 && <p>Задач нет</p>}
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card">
            <h2>{task.title}</h2>
            <p>Приоритет: {task.priority}</p>
            <p>Статус: {task.status}</p>
            <p>Создано: {new Date(task.createdAt).toLocaleString()}</p>
            <Link href={`/tasks/${task.id}`}>
              <button className="details-btn">Подробнее</button>
            </Link>
          </div>
        ))}
      </div>
      <KanbanBoard />
    </main>
  );
}