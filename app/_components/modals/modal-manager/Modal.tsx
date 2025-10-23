"use client";

import React, { useState, useCallback } from "react";
import ModalManagerContext from "./ModalManagerContext";

interface ModalProps {
  children: React.ReactNode;
}

/**
 * Modal Provider Component
 *
 * Manages the state of all modals in the application.
 * Handles opening, closing, and stacking of multiple modals.
 * Use the `useModalManager` hook to control modals from child components.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalContent id="modal1">Content 1</ModalContent>
 *   <ModalContent id="modal2">Content 2</ModalContent>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({ children }) => {
  const [activeModalIds, setActiveModalIds] = useState<string[]>([]);

  const openModal = useCallback((id: string) => {
    setActiveModalIds((prev) => {
      // Prevent duplicate modal IDs
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setActiveModalIds((prev) => prev.filter((modalId) => modalId !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveModalIds([]);
  }, []);

  const isModalOpen = useCallback(
    (id: string) => {
      return activeModalIds.includes(id);
    },
    [activeModalIds],
  );

  const contextValue = {
    activeModalIds,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
  };

  return (
    <ModalManagerContext.Provider value={contextValue}>
      {children}
    </ModalManagerContext.Provider>
  );
};
