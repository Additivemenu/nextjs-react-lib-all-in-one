"use client";

import React, { useReducer, useState } from "react";

// Types
type Priority = "low" | "medium" | "high";
type Category = "work" | "personal" | "shopping" | "health";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: Date;
}

interface TaskState {
  tasks: Task[];
  filter: {
    status: "all" | "active" | "completed";
    priority: Priority | "all";
    category: Category | "all";
  };
  history: Task[][];
  historyIndex: number;
}

type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id"> }
  | { type: "TOGGLE_TASK"; payload: number }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "SET_FILTER"; payload: Partial<TaskState["filter"]> }
  | { type: "UNDO" }
  | { type: "REDO" };

// Reducer function
// The reducer pattern is necessary here for several reasons:
// 1. Complex State Structure: We're managing tasks, filters, and history in one state object.
// 2. Multiple Ways to Update State: We have many actions that can update the state in different ways.
// 3. Derived State: We need to maintain a history of states for undo/redo functionality.
// 4. Predictable State Updates: Each action results in a predictable state change.
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  let newTasks: Task[];
  let newHistory: Task[][];
  let newHistoryIndex: number;

  switch (action.type) {
    case "ADD_TASK":
      newTasks = [...state.tasks, { ...action.payload, id: Date.now() }];
      newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newTasks,
      ];
      newHistoryIndex = newHistory.length - 1;
      return {
        ...state,
        tasks: newTasks,
        history: newHistory,
        historyIndex: newHistoryIndex,
      };

    case "TOGGLE_TASK":
      newTasks = state.tasks.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task,
      );
      newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newTasks,
      ];
      newHistoryIndex = newHistory.length - 1;
      return {
        ...state,
        tasks: newTasks,
        history: newHistory,
        historyIndex: newHistoryIndex,
      };

    case "UPDATE_TASK":
      newTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task,
      );
      newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newTasks,
      ];
      newHistoryIndex = newHistory.length - 1;
      return {
        ...state,
        tasks: newTasks,
        history: newHistory,
        historyIndex: newHistoryIndex,
      };

    case "DELETE_TASK":
      newTasks = state.tasks.filter((task) => task.id !== action.payload);
      newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newTasks,
      ];
      newHistoryIndex = newHistory.length - 1;
      return {
        ...state,
        tasks: newTasks,
        history: newHistory,
        historyIndex: newHistoryIndex,
      };

    case "SET_FILTER":
      return { ...state, filter: { ...state.filter, ...action.payload } };

    case "UNDO":
      if (state.historyIndex > 0) {
        return {
          ...state,
          tasks: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          tasks: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
};

// Component
const TaskManager: React.FC = () => {
  // Initial state
  const initialState: TaskState = {
    tasks: [],
    filter: { status: "all", priority: "all", category: "all" },
    history: [[]],
    historyIndex: 0,
  };

  // useReducer is preferable to useState here because:
  // 1. It centralizes all state update logic in one place (the reducer function).
  // 2. It makes it easier to implement complex features like undo/redo.
  // 3. It provides a clear structure for handling many different types of state updates.
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // We still use useState for the new task form because this is local, temporary state
  // that doesn't need to be part of the main application state.
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    dueDate: new Date(),
  });

  const handleAddTask = () => {
    dispatch({ type: "ADD_TASK", payload: { ...newTask, completed: false } });
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      dueDate: new Date(),
    });
  };

  // This is an example of derived state. We compute it based on the current state and filters.
  // The reducer pattern makes it easy to keep this computation up-to-date with the latest state.
  const filteredTasks = state.tasks.filter((task) => {
    const statusMatch =
      state.filter.status === "all" ||
      (state.filter.status === "active" && !task.completed) ||
      (state.filter.status === "completed" && task.completed);
    const priorityMatch =
      state.filter.priority === "all" ||
      task.priority === state.filter.priority;
    const categoryMatch =
      state.filter.category === "all" ||
      task.category === state.filter.category;
    return statusMatch && priorityMatch && categoryMatch;
  });

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Task Manager
      </h1>

      {/* Add Task Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description"
          />
        </div>
        <div className="flex mb-4">
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value as Priority })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
            value={newTask.category}
            onChange={(e) =>
              setNewTask({ ...newTask, category: e.target.value as Category })
            }
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            value={newTask.dueDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: new Date(e.target.value) })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex mb-4">
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
          value={state.filter.status}
          onChange={(e) =>
            dispatch({
              type: "SET_FILTER",
              payload: {
                status: e.target.value as "all" | "active" | "completed",
              },
            })
          }
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
          value={state.filter.priority}
          onChange={(e) =>
            dispatch({
              type: "SET_FILTER",
              payload: { priority: e.target.value as Priority | "all" },
            })
          }
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={state.filter.category}
          onChange={(e) =>
            dispatch({
              type: "SET_FILTER",
              payload: { category: e.target.value as Category | "all" },
            })
          }
        >
          <option value="all">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  dispatch({ type: "TOGGLE_TASK", payload: task.id })
                }
                className="mr-2"
              />
              <span
                className={`font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                } mr-2`}
              >
                {task.priority}
              </span>
              <span className="text-sm text-gray-600 mr-2">
                {task.category}
              </span>
              <span className="text-sm text-gray-600 mr-2">
                {task.dueDate.toLocaleDateString()}
              </span>
              <button
                onClick={() =>
                  dispatch({ type: "DELETE_TASK", payload: task.id })
                }
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Undo/Redo */}
      <div className="flex justify-end">
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.historyIndex === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          disabled={state.historyIndex === state.history.length - 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default TaskManager;
