import React, { useState, useCallback, useRef } from "react";
import { Check, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodoStore } from "../store/todo-store";

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


export default TodoList;