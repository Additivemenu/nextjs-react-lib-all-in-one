"use client";

import { create } from "zustand";


// Types
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => Todo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
};

// Zustand store
export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  addTodo: (text: string) => {
    const newTodo = { id: Date.now(), text, completed: false };
    set((state) => ({ todos: [...state.todos, newTodo] }));
    return newTodo;
  },
  toggleTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
  removeTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));
