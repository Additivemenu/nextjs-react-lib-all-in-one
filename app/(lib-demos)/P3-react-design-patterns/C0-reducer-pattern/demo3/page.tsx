"use client";

import React from "react";
import { create } from "zustand";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ChatbotClient from "./components/ChatbotClient";
import { ChatBotProvider, useChatWindow } from "react-chatbotify";

// Define Todo type
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// Define store type
interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, description: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, description: string) => void;
}

// Create Zustand store
const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (title, description) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          title,
          description,
          completed: false,
        },
      ],
    })),
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
}));

// AddTodoDialog Component
const AddTodoDialog: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = () => {
    if (title.trim()) {
      addTodo(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} /> Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Todo description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="w-full">
              Add Todo
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// EditTodoDialog Component
const EditTodoDialog: React.FC<{
  todo: Todo;
}> = ({ todo }) => {
  const [title, setTitle] = React.useState(todo.title);
  const [description, setDescription] = React.useState(todo.description);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const handleSubmit = () => {
    if (title.trim()) {
      updateTodo(todo.id, title, description);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Todo description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="w-full">
              Update Todo
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// TodoItem Component
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
        <EditTodoDialog todo={todo} />
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

  const { toggleChatWindow } = useChatWindow();

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Todo List</CardTitle>
          <AddTodoDialog />
        </CardHeader>
        <CardContent className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">
              No todos yet. Add one to get started!
            </p>
          ) : (
            todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}

          <button
            onClick={() => {
              toggleChatWindow();
            }}
          >
            {" "}
            toggle chat window
          </button>
        </CardContent>
      </Card>
      <ChatbotClient />
    </>
  );
};

const Page: React.FC = () => {
  return (
    <div className="p-4">
      <ChatBotProvider>
        <TodoList />
      </ChatBotProvider>
    </div>
  );
};

export default Page;
