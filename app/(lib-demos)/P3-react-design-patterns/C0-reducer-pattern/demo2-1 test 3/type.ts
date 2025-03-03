import { TaskFormData } from "./form";

// Types
export type Priority = "low" | "medium" | "high";
export type Category = "work" | "personal" | "shopping" | "health";

export interface Task extends TaskFormData {
  id: number;
  completed: boolean;
}

// state in reducer pattern is usually a complex object
export interface TaskState {
  tasks: Task[];
  filter: {
    status: "all" | "active" | "completed";
    priority: Priority | "all";
    category: Category | "all";
  };
  history: Task[][];
  historyIndex: number;
}

// this provides guidance for ts type guard in the reducer function
export type TaskAction =
  | { type: "ADD_TASK"; payload: TaskFormData }
  | { type: "TOGGLE_TASK"; payload: number }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "SET_FILTER"; payload: Partial<TaskState["filter"]> }
  | { type: "UNDO" }
  | { type: "REDO" };
