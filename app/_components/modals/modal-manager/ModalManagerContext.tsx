import React from "react";

export interface ModalManagerContextValue {
  activeModalIds: string[];
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
}

const ModalManagerContext =
  React.createContext<ModalManagerContextValue | null>(null);

export const useModal = () => {
  const context = React.useContext(ModalManagerContext);
  if (!context) {
    throw new Error("useModalManager must be used within a Modal provider");
  }
  return context;
};

export default ModalManagerContext;
