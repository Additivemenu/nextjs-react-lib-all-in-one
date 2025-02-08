import { ReactNode, useReducer } from "react";
import { TaskContext } from "./context";
import { taskReducer } from "../_reducers/task-reducer";
import { TaskState } from "../type";

const initialState: TaskState = {
  tasks: [],
  filter: { status: "all", priority: "all", category: "all" },
  history: [[]],
  historyIndex: 0,
};

// Provider component
interface TaskProviderProps {
  children: ReactNode;
}

/**
 * context means lifting state, and a level of encapsulation
 * usually packed with other hooks
 *
 * @param param0
 * @returns
 */
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // lift hooks at provider level
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
