"use client";

import React, { useState, useCallback, useRef } from "react";
import { Check, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { createRoot } from "react-dom/client";

import { Todo } from "./store/todo-store";
import { useTodoStore } from "./store/todo-store";
import AddTodoModal from "./components/add-todo-modal";
import TodoList from "./components/todo-list";

// Main App component
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addTodo = useTodoStore((state) => state.addTodo);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const openAndAddNewTodos = useCallback(() => {
    return new Promise<Todo[]>((resolve) => {
      const newTodos: Todo[] = []; // ! track temp todos added programmatically in this async operation

      // Create a new div for the modal
      if (!modalRef.current) {
        modalRef.current = document.createElement("div");
        document.body.appendChild(modalRef.current);
      }

      // Create a root for the modal
      const root = createRoot(modalRef.current);

      const handleAddTodo = (text: string) => {
        const newTodo = addTodo(text);
        newTodos.push(newTodo);
      };

      const handleClose = () => {
        root.unmount();
        if (modalRef.current) {
          document.body.removeChild(modalRef.current);
          modalRef.current = null;
        }
        resolve(newTodos);
      };

      const ModalComponent = () => (
        <AddTodoModal
          isOpen={true}
          onClose={handleClose}
          onAddTodo={handleAddTodo}
        />
      );

      root.render(<ModalComponent />);
    });
  }, [addTodo]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Todo List - programmatically
        </h1>
      </header>
      <div className="flex justify-between">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Todo
        </Button>
        <Button
          onClick={async () => {
            const newlyAddedTodos = await openAndAddNewTodos();
            console.log("Newly added todos:", newlyAddedTodos);
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Todos Programmatically
        </Button>
      </div>

      <TodoList />
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTodo={addTodo}
      />
    </div>
  );
};

export default App;
