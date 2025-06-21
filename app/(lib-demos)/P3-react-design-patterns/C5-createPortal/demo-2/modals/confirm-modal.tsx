"use client";

import React, { ReactNode } from "react";
import { BaseModalProps } from ".";

// Confirmation Modal Component Props
export interface ConfirmModalProps extends BaseModalProps {
  onConfirm?: () => void;
  title?: string;
  message?: string;
}

// Confirmation Modal Component
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onClose,
  onConfirm,
  title = "Confirm",
  message,
}) => (
  <div
    className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
    onClick={(e: React.MouseEvent) => e.stopPropagation()}
  >
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <p className="mb-6">{message || "Are you sure you want to proceed?"}</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        type="button"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onConfirm?.();
          onClose();
        }}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        type="button"
      >
        Confirm
      </button>
    </div>
  </div>
);
