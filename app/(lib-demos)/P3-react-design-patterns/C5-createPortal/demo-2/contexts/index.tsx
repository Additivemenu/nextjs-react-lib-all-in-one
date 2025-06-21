"use client";

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  ReactNode,
  ComponentType,
} from "react";

// Types for modal system
export interface ModalData {
  id: string;
  component: ComponentType<any>;
  props: Record<string, any>;
  zIndex: number;
}

export interface ModalContextType {
  modals: ModalData[];
  openModal: <T extends Record<string, any>>(
    modalComponent: ComponentType<T & { onClose: () => void }>,
    modalProps?: T,
  ) => string;
  closeModal: (modalId: string) => void;
  closeTopModal: () => void;
  closeAllModals: () => void;
}

export interface ModalProviderProps {
  children: ReactNode;
}

// Modal context for managing the stack
const ModalContext = createContext<ModalContextType | null>(null);

// Modal Manager Provider
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = useCallback(
    <T extends Record<string, any>>(
      modalComponent: ComponentType<T & { onClose: () => void }>,
      modalProps: T = {} as T,
    ): string => {
      const modalId = Date.now().toString();
      const modal: ModalData = {
        id: modalId,
        component: modalComponent,
        props: modalProps,
        zIndex: 1000 + modals.length,
      };
      setModals((prev) => [...prev, modal]);
      return modalId;
    },
    [modals.length],
  );

  const closeModal = useCallback((modalId: string): void => {
    setModals((prev) => prev.filter((modal) => modal.id !== modalId));
  }, []);

  const closeTopModal = useCallback((): void => {
    setModals((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const closeAllModals = useCallback((): void => {
    setModals([]);
  }, []);

  // Handle escape key - only close top modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && modals.length > 0) {
        closeTopModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modals.length, closeTopModal]);

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
