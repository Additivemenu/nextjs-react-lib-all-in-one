"use client";

import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { Trash2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoAction {
  type: "add";
  payload: {
    title: string;
    description: string;
  };
  delay?: number; // delay in milliseconds
  waitFor?: string; // id of the todo to wait for
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, description: string) => string; // Returns the id
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, description: string) => void;
  clearTodos: () => void;
}

// Create Zustand store
const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (title, description) => {
    const id = Date.now().toString();
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id,
          title,
          description,
          completed: false,
        },
      ],
    }));
    return id;
  },
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  updateTodo: (id, title, description) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title, description } : todo,
      ),
    })),
  clearTodos: () => set({ todos: [] }),
}));

// Sequence Executor Component
const SequenceExecutor: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const addTodo = useTodoStore((state) => state.addTodo);
  const clearTodos = useTodoStore((state) => state.clearTodos);

  // Example sequence
  const sequence: TodoAction[] = [
    {
      type: "add",
      payload: {
        title: "First Task",
        description: "This is the first task in the sequence",
      },
    },
    {
      type: "add",
      payload: {
        title: "Second Task",
        description: "This will be added 2 seconds after the first task",
      },
      delay: 2000,
    },
    {
      type: "add",
      payload: {
        title: "Third Task",
        description: "This will be added immediately after the second task",
      },
      waitFor: "previous",
    },
  ];

  // ! the core function that executes the sequence
  const executeSequence = async () => {
    setIsRunning(true);
    let previousTodoId: string | null = null;

    // ! have to use for-of loop to use await inside the loop, otherwise all promises will be executed concurrently
    for (const [index, action] of sequence.entries()) {
      setCurrentAction(`Executing action ${index + 1} of ${sequence.length}`);

      if (action.delay) {
        await new Promise((resolve) => setTimeout(resolve, action.delay));
      }

      if (action.waitFor === "previous" && previousTodoId) {
        // In a real app, you might want to wait for some condition on the previous todo
        // For now, we'll just ensure the previous todo exists
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (action.type === "add") {
        previousTodoId = addTodo(
          action.payload.title,
          action.payload.description,
        );
      }
    }

    setCurrentAction(null);
    setIsRunning(false);
  };

  const resetSequence = () => {
    clearTodos();
    setIsRunning(false);
    setCurrentAction(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={executeSequence}
          disabled={isRunning}
          className="gap-2"
        >
          <Play size={16} />
          Run Sequence
        </Button>
        <Button onClick={resetSequence} variant="outline" className="gap-2">
          <RotateCcw size={16} />
          Reset
        </Button>
      </div>

      {currentAction && (
        <Alert>
          <AlertDescription>{currentAction}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// TodoItem Component (same as before)
const TodoItem: React.FC<{
  todo: Todo;
}> = ({ todo }) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
      />
      <div className="flex-1">
        <h3
          className={`font-medium ${
            todo.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </h3>
        <p
          className={`text-sm ${
            todo.completed ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {todo.description}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

// Main TodoList Component
const TodoList: React.FC = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Todo List with Sequence Executor</CardTitle>
        <SequenceExecutor />
      </CardHeader>
      <CardContent className="space-y-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet. Run the sequence to add todos automatically!
          </p>
        ) : (
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
