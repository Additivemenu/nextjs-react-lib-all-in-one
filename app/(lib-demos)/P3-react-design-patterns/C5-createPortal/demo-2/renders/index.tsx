"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useModal } from "../contexts";

// Modal Renderer Component
export const ModalRenderer: React.FC = () => {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map((modal) => {
        const ModalComponent = modal.component;
        return createPortal(
          <div
            key={modal.id}
            className="fixed inset-0 flex items-center justify-center"
            style={{
              zIndex: modal.zIndex,
              backgroundColor: `rgba(0, 0, 0, ${
                0.1 + modals.indexOf(modal) * 0.1
              })`,
            }}
            onClick={(e: React.MouseEvent) => {
              if (e.target === e.currentTarget) {
                closeModal(modal.id);
              }
            }}
          >
            <ModalComponent
              onClose={() => closeModal(modal.id)}
              {...modal.props}
            />
          </div>,
          document.body,
        );
      })}
    </>
  );
};
