// src/types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface TodoState {
  todos: Todo[];
  selectedTodoId: string | null;
  filter: "all" | "active" | "completed";
}
