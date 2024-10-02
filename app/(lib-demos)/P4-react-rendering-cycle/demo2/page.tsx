"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

export default function SimplifiedTaskManager() {
  console.log("SimplifiedTaskManager rendering");

  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    console.log("Filtering tasks");
    return tasks.filter((task) => {
      if (filter === "completed") return task.startsWith("✓");
      if (filter === "active") return !task.startsWith("✓");
      return true;
    });
  }, [tasks, filter]);

  // Debounced task input
  const debouncedSetNewTask = useCallback((value: string) => {
    const timeoutId = setTimeout(() => setNewTask(value), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    console.log("Effect: New task changed:", newTask);
  }, [newTask]);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  }, [newTask]);

  const toggleTask = useCallback((index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index
          ? task.startsWith("✓")
            ? task.slice(1)
            : `✓${task}`
          : task,
      ),
    );
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newTask}
          onChange={(e) => debouncedSetNewTask(e.target.value)}
          placeholder="New task"
          className="flex-grow mr-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`mr-2 px-3 py-1 rounded ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`mr-2 px-3 py-1 rounded ${
            filter === "active"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Completed
        </button>
      </div>

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={task.startsWith("✓")}
              onChange={() => toggleTask(index)}
              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
            />
            <span className={task.startsWith("✓") ? "line-through" : ""}>
              {task.startsWith("✓") ? task.slice(1) : task}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
