import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";

// AddTodoModal component
const AddTodoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddTodo: (text: string) => void;
}> = ({ isOpen, onClose, onAddTodo }) => {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo);  // !
      setNewTodo("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Todo
          </DialogTitle>
          <DialogDescription className="text-sm">
            Add a new todo item to your list.
          </DialogDescription>
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

export default AddTodoModal;
