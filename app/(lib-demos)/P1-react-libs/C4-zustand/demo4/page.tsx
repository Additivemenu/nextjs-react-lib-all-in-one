"use client";

// src/components/TodoApp.tsx
import React, { useState } from "react";
import useTodoStore from "./store";
import { TodoState, Todo } from "./types";

const TodoApp: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState("");
  const {
    todos,
    filter,
    selectedTodoId,
    addTodo,
    toggleTodo,
    updatePriority,
    removeTodo,
    setFilter,
    selectTodo,
  } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText("");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(["all", "active", "completed"] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded ${
              filter === filterType
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 border rounded ${
              selectedTodoId === todo.id ? "border-blue-500" : ""
            }`}
            onClick={() => selectTodo(todo.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleTodo(todo.id);
                  }}
                  className="h-5 w-5"
                />
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={todo.priority}
                  onChange={(e) => {
                    e.stopPropagation();
                    updatePriority(todo.id, e.target.value as Todo["priority"]);
                  }}
                  className="p-1 border rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTodo(todo.id);
                  }}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
