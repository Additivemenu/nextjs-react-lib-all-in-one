"use client";

import React, { useEffect, useState } from "react";
import { TaskEvent } from "../types/task";

interface TaskProgressProps {
  taskId: string;
  onComplete?: () => void;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({
  taskId,
  onComplete,
}) => {
  const [subtasks, setSubtasks] = useState<Record<string, TaskEvent>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8000/api/sse-tasks/tasks/${taskId}/progress`);

    eventSource.onmessage = (event) => {
      const data: TaskEvent = JSON.parse(event.data);
      setSubtasks((prev) => ({
        ...prev,
        [data.subtask_name]: data,
      }));

      // Check if all subtasks are completed
      if (
        data.status === "completed" &&
        Object.values(subtasks).every((task) => task.status === "completed")
      ) {
        eventSource.close();
        onComplete?.();
      }

      if (data.status === "failed") {
        setError(data.message || "Task failed");
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setError("Connection to server lost");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId, onComplete]);

  if (Object.keys(subtasks).length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing task...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {Object.values(subtasks).map((subtask) => (
        <div
          key={subtask.subtask_name}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{subtask.subtask_name}</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                subtask.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : subtask.status === "failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {subtask.status}
            </span>
          </div>

          {subtask.progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-500 ease-in-out"
                style={{ width: `${subtask.progress}%` }}
              />
            </div>
          )}

          {subtask.message && (
            <p className="text-sm text-gray-600 mt-2">{subtask.message}</p>
          )}
        </div>
      ))}
    </div>
  );
};
