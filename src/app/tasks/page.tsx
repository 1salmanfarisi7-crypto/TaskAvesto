'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/features/tasks/hooks';
import { TaskPriority, TaskStatus } from '@/features/tasks/type';

export default function NewTaskPage() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('new');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    const newErrors: typeof errors = {};
    if (!title || title.length < 3) newErrors.title = 'Минимум 3 символа';
    if (title.length > 100) newErrors.title = 'Максимум 100 символов';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    addTask({ title, description, priority, status });

    router.push('/'); // редирект на главную
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Создать задачу</h1>
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
          Создать
        </button>
      </form>
    </main>
  );
}