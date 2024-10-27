"use client";

import React from "react";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { Plus, Trash2, Play, RotateCcw, Loader2 } from "lucide-react";
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

interface TodoContext {
  todos: Todo[];
  currentAction: string | null;
  error: string | null;
}

// Define the events that can occur in our system
type TodoEvent =
  | { type: "START_SEQUENCE" }
  | { type: "RESET" }
  | { type: "TOGGLE_TODO"; id: string }
  | { type: "DELETE_TODO"; id: string };

// Create the state machine
const todoMachine = createMachine<TodoContext, TodoEvent>(
  {
    id: "todo",
    initial: "idle",
    context: {
      todos: [],
      currentAction: null,
      error: null,
    },
    states: {
      idle: {
        on: {
          START_SEQUENCE: "addingFirstTodo",
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
          RESET: {
            actions: "resetTodos",
          },
        },
      },
      addingFirstTodo: {
        entry: assign({
          currentAction: () => "Adding first todo...",
        }),
        after: {
          1000: {
            target: "waitingForSecond",
            actions: assign({
              todos: (context) => [
                ...context.todos,
                {
                  id: Date.now().toString(),
                  title: "First Task",
                  description: "This is the first task in the sequence",
                  completed: false,
                },
              ],
            }),
          },
        },
        on: {
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
        },
      },
      waitingForSecond: {
        entry: assign({
          currentAction: () => "Waiting 2 seconds before adding second todo...",
        }),
        after: {
          2000: "addingSecondTodo",
        },
        on: {
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
        },
      },
      addingSecondTodo: {
        entry: assign({
          currentAction: () => "Adding second todo...",
        }),
        after: {
          1000: {
            target: "addingThirdTodo",
            actions: assign({
              todos: (context) => [
                ...context.todos,
                {
                  id: Date.now().toString(),
                  title: "Second Task",
                  description: "This was added after 2 seconds",
                  completed: false,
                },
              ],
            }),
          },
        },
        on: {
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
        },
      },
      addingThirdTodo: {
        entry: assign({
          currentAction: () => "Adding final todo...",
        }),
        after: {
          500: {
            target: "complete",
            actions: assign({
              todos: (context) => [
                ...context.todos,
                {
                  id: Date.now().toString(),
                  title: "Third Task",
                  description:
                    "This was added immediately after the second task",
                  completed: false,
                },
              ],
              currentAction: null,
            }),
          },
        },
        on: {
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
        },
      },
      complete: {
        on: {
          START_SEQUENCE: "addingFirstTodo",
          TOGGLE_TODO: {
            actions: "toggleTodo",
          },
          DELETE_TODO: {
            actions: "deleteTodo",
          },
          RESET: {
            actions: "resetTodos",
            target: "idle",
          },
        },
      },
    },
  },
  {
    actions: {
      toggleTodo: assign({
        todos: (context, event) => {
          if (event.type !== "TOGGLE_TODO") return context.todos;
          return context.todos.map((todo) =>
            todo.id === event.id
              ? { ...todo, completed: !todo.completed }
              : todo,
          );
        },
      }),
      deleteTodo: assign({
        todos: (context, event) => {
          if (event.type !== "DELETE_TODO") return context.todos;
          return context.todos.filter((todo) => todo.id !== event.id);
        },
      }),
      resetTodos: assign({
        todos: () => [],
        currentAction: null,
        error: null,
      }),
    },
  },
);

// TodoItem Component
const TodoItem: React.FC<{
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
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
        <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

// Main TodoList Component
const TodoList: React.FC = () => {
  const [state, send] = useMachine(todoMachine);

  const isRunning = !["idle", "complete"].includes(state.value as string);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Todo List with XState</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => send("START_SEQUENCE")}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            Run Sequence
          </Button>
          <Button
            onClick={() => send("RESET")}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.context.currentAction && (
          <Alert>
            <AlertDescription>{state.context.currentAction}</AlertDescription>
          </Alert>
        )}

        {state.context.todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet. Run the sequence to add todos automatically!
          </p>
        ) : (
          state.context.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={(id) => send({ type: "TOGGLE_TODO", id })}
              onDelete={(id) => send({ type: "DELETE_TODO", id })}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
