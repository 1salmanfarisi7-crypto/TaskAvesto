'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/features/tasks/hooks';
import Link from 'next/link';
import { useState } from 'react';

export default function TaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tasks, deleteTask } = useTasks();
  const task = tasks.find(t => t.id === id);

  const [showConfirm, setShowConfirm] = useState(false);

  if (!task) return <p>Задача не найдена</p>;

  const handleDelete = () => {
    deleteTask(task.id);
    router.push('/');
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p><strong>Описание:</strong> {task.description || '-'}</p>
      <p><strong>Приоритет:</strong> {task.priority}</p>
      <p><strong>Статус:</strong> {task.status}</p>
      <p><strong>Создано:</strong> {new Date(task.createdAt).toLocaleString()}</p>

      <div className="flex gap-4 mt-4">
        <Link href={`/tasks/${task.id}/edit`}>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            Редактировать
          </button>
        </Link>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setShowConfirm(true)}
        >
          Удалить
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <p className="mb-4">Вы уверены, что хотите удалить эту задачу?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowConfirm(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white"
                onClick={handleDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}