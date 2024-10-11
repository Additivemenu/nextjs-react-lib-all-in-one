import { createContext, useContext } from "react";
import { TaskAction, TaskState } from "../type";

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

// Custom hook to use the TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }

  return context;
};
