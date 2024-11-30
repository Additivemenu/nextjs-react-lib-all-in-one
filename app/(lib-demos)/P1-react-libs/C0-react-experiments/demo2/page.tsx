"use client";

import React, { useState, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Modal Title",
}) => {
  if (!isOpen) return null;

  return createPortal(
    // ! the backdrop background of the modal
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={(e) => {
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* !the modal window */}
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-96 p-6 bg-white"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {title && (
          <h2 id="modal-title" className="text-xl font-bold mb-4">
            {title}
          </h2>
        )}
        {children}
      </Card>
    </div>,
    document.body,
  );
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

      {/* ! but this goes to under body tag */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hello from Portal!"
      >
        <p className="mb-4">
          This modal is rendered outside the normal DOM hierarchy, directly
          under the body tag.
        </p>
        <Button onClick={() => setIsModalOpen(false)}>Close Modal</Button>
      </Modal>
    </div>
  );
};

export default App;
