import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TaskFormData } from "../form";
import { Task, TaskState, Priority, Category } from "../type";

interface TaskStore extends TaskState {
  // Actions
  addTask: (task: TaskFormData) => void;
  toggleTask: (id: number) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  setFilter: (filter: Partial<TaskState["filter"]>) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * ! immutability in state management
 *
 */
export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tasks: [],
      filter: {
        status: "all",
        priority: "all",
        category: "all",
      },
      history: [[]],
      historyIndex: 0,

      // Actions
      addTask: (taskData) => {
        const state = get();
        const newTask = {
          ...taskData,
          id: Date.now(),
          completed: false,
        };
        const newTasks = [...state.tasks, newTask];
        const newHistory = [
          ...state.history.slice(0, state.historyIndex + 1),
          newTasks,
        ];

        set({
          tasks: newTasks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      toggleTask: (id) => {
        const state = get();
        const newTasks = state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        );
        const newHistory = [
          ...state.history.slice(0, state.historyIndex + 1),
          newTasks,
        ];

        set({
          tasks: newTasks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      updateTask: (updatedTask) => {
        const state = get();
        const newTasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        );
        const newHistory = [
          ...state.history.slice(0, state.historyIndex + 1),
          newTasks,
        ];

        set({
          tasks: newTasks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      deleteTask: (id) => {
        const state = get();
        const newTasks = state.tasks.filter((task) => task.id !== id);
        const newHistory = [
          ...state.history.slice(0, state.historyIndex + 1),
          newTasks,
        ];

        set({
          tasks: newTasks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          set({
            tasks: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1,
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          set({
            tasks: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1,
          });
        }
      },
    }),
    // config for redux devtools
    {
      name: "task-store",
      enabled: true, // ! enable devtools in any environment
    },
  ),
);
