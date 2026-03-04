'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/features/tasks/hooks';
import { TaskPriority, TaskStatus } from '@/features/tasks/type';

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tasks, updateTask } = useTasks();
  const task = tasks.find(t => t.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('new');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  if (!task) return <p>Задача не найдена</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title || title.length < 3) newErrors.title = 'Минимум 3 символа';
    if (title.length > 100) newErrors.title = 'Максимум 100 символов';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateTask(task.id, { title, description, priority, status });
    router.push(`/tasks/${task.id}`);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Редактировать задачу</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold">Название</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-semibold">Описание</label>
          <textarea
            className="border p-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Приоритет</label>
          <select
            className="border p-2 w-full rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Статус</label>
          <select
            className="border p-2 w-full rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="new">Новая</option>
            <option value="in-progress">В работе</option>
            <option value="done">Завершена</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Сохранить
        </button>
      </form>
    </main>
  );
}