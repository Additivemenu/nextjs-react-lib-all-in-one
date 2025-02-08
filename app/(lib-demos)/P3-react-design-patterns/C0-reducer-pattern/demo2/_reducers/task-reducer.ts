import { Task, TaskState, TaskAction } from "../type";

/**
 * 
 * Reducer function: this serves like a store in redux or in zustand
 * 
 * benefit of using reducer pattern
 * 1. centralize state management
 * 2. Separating the what (the action) from the how (the state update logic)
 * 3. Providing a clear structure for handling complex state
 * 
 * redux, zustand store are also using this pattern
 * essentially, it's the command pattern
 * 
 * @param state 
 * @param action 
 * @returns 
 */
export const taskReducer = (
  state: TaskState,
  action: TaskAction,
): TaskState => {
  let newTasks: Task[];
  let newHistory: Task[][];
  let newHistoryIndex: number;

  switch (action.type) {
    case "ADD_TASK":
      newTasks = [
        ...state.tasks,
        { ...action.payload, id: Date.now(), completed: false },
      ];
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
