import { taskReducer } from "./task-reducer";
import { TaskState, TaskAction } from "../type";

// Mock data
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  priority: "medium" as const,
  category: "work" as const,
  dueDate: new Date().toISOString().split("T")[0],
  completed: false,
};

const mockInitialState: TaskState = {
  tasks: [mockTask],
  filter: { status: "all", priority: "all", category: "all" },
  history: [[mockTask]],
  historyIndex: 0,
};

describe("taskReducer", () => {
  it("should handle ADD_TASK action", () => {
    const initialState: TaskState = {
      tasks: [],
      filter: { status: "all", priority: "all", category: "all" },
      history: [[]],
      historyIndex: 0,
    };

    const newTask = {
      title: "New Task",
      description: "Description",
      priority: "high" as const,
      category: "work" as const,
      dueDate: "2025-12-31",
    };

    const action: TaskAction = {
      type: "ADD_TASK",
      payload: newTask,
    };

    const newState = taskReducer(initialState, action);

    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0].title).toBe("New Task");
    expect(newState.tasks[0].completed).toBe(false);
    expect(newState.history).toHaveLength(2);
  });

  it("should handle TOGGLE_TASK action", () => {
    const action: TaskAction = {
      type: "TOGGLE_TASK",
      payload: mockTask.id,
    };

    const newState = taskReducer(mockInitialState, action);

    expect(newState.tasks[0].completed).toBe(true);
    expect(newState.history).toHaveLength(2);
  });

  it("should handle DELETE_TASK action", () => {
    const action: TaskAction = {
      type: "DELETE_TASK",
      payload: mockTask.id,
    };

    const newState = taskReducer(mockInitialState, action);

    expect(newState.tasks).toHaveLength(0);
    expect(newState.history).toHaveLength(2);
  });

  it("should handle SET_FILTER action", () => {
    const action: TaskAction = {
      type: "SET_FILTER",
      payload: { status: "completed" },
    };

    const newState = taskReducer(mockInitialState, action);

    expect(newState.filter.status).toBe("completed");
    expect(newState.filter.priority).toBe("all"); // Other filters remain unchanged
  });

  it("should handle UNDO action", () => {
    const stateWithHistory: TaskState = {
      ...mockInitialState,
      history: [[], [mockTask]],
      historyIndex: 1,
    };

    const action: TaskAction = { type: "UNDO" };
    const newState = taskReducer(stateWithHistory, action);

    expect(newState.historyIndex).toBe(0);
    expect(newState.tasks).toHaveLength(0);
  });

  it("should handle REDO action", () => {
    const stateWithHistory: TaskState = {
      ...mockInitialState,
      history: [[], [mockTask]],
      historyIndex: 0,
    };

    const action: TaskAction = { type: "REDO" };
    const newState = taskReducer(stateWithHistory, action);

    expect(newState.historyIndex).toBe(1);
    expect(newState.tasks).toHaveLength(1);
  });
});
