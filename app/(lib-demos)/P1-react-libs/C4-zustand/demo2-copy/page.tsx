"use client";

import React, { useState } from "react";
import { create } from "zustand";
import { Check, Trash2, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
};

// Zustand store
const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, completed: false }],
    })),
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

// AddTodoModal component
const AddTodoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = () => {
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Todo
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
            className="w-full"
          />
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handleSubmit} className="w-full">
            Add Todo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// TodoList component
const TodoList: React.FC = () => {
  const { todos, toggleTodo, removeTodo } = useTodoStore();

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p className="text-lg">No todos yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 mt-6">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-200 ${
            todo.completed ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              className={`w-6 h-6 rounded-full ${
                todo.completed ? "bg-green-500 text-white" : "text-gray-400"
              }`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed && <Check className="w-4 h-4" />}
            </Button>
            <span
              className={`text-lg ${
                todo.completed ? "text-gray-500 line-through" : "text-gray-700"
              }`}
            >
              {todo.text}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={() => removeTodo(todo.id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </li>
      ))}
    </ul>
  );
};

// Main App component
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Todo
        </Button>
      </header>
      <TodoList />
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;
