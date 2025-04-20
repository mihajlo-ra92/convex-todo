"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const toggleTask = useMutation(api.tasks.toggle);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-md space-y-4">
        {tasks?.map((task) => (
          <div
            key={task._id}
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask({ id: task._id })}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className={task.isCompleted ? "line-through text-gray-500" : ""}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
