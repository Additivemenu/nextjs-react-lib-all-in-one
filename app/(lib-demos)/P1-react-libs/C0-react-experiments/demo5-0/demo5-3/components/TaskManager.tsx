"use client";

import React, { useState } from "react";
import { TaskProgress } from "./TaskProgress";

interface LoadingState {
  create: boolean;
  start: boolean;
}

export const TaskManager: React.FC = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    create: false,
    start: false,
  });
  const [error, setError] = useState<string | null>(null);

  const createTask = async () => {
    setLoading((prev) => ({ ...prev, create: true }));
    setError(null);

    try {
      // TODO:
      const response = await fetch(
        "http://localhost:8000/api/sse-tasks/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      setTaskId(data.task_id);
    } catch (error) {
      setError(
        "Failed to create task: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const startTask = async () => {
    if (!taskId) return;

    setLoading((prev) => ({ ...prev, start: true }));
    setError(null);

    // TODO:
    try {
      const response = await fetch(
        `http://localhost:8000/api/sse-tasks/tasks/${taskId}/start`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to start task");
      }

      setIsProcessing(true);
    } catch (error) {
      setError(
        "Failed to start task: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoading((prev) => ({ ...prev, start: false }));
    }
  };

  const resetTask = () => {
    setTaskId(null);
    setIsProcessing(false);
    setError(null);
  };

  const handleTaskComplete = () => {
    // Optional: Add any completion handling logic here
    console.log("Task completed successfully");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Task Processing Demo</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!taskId && (
            <button
              onClick={createTask}
              disabled={loading.create}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-blue-300 transition-colors"
            >
              {loading.create ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Creating...
                </span>
              ) : (
                "Create New Task"
              )}
            </button>
          )}

          {taskId && !isProcessing && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Task ID:</p>
                <p className="font-mono text-sm">{taskId}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={startTask}
                  disabled={loading.start}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-green-300 transition-colors"
                >
                  {loading.start ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Starting...
                    </span>
                  ) : (
                    "Start Processing"
                  )}
                </button>

                <button
                  onClick={resetTask}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {isProcessing && taskId && (
            <div className="space-y-4">
              <TaskProgress taskId={taskId} onComplete={handleTaskComplete} />

              <button
                onClick={resetTask}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Start New Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
