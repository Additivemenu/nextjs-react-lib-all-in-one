"use client";

import React, { ReactNode } from "react";
import { BaseModalProps } from ".";

// Simple Modal Component Props
export interface SimpleModalProps extends BaseModalProps {
  title?: string;
  children?: ReactNode;
}

// Simple Modal Component
export const SimpleModal: React.FC<SimpleModalProps> = ({
  onClose,
  title = "Modal",
  children,
}) => (
  <div
    className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
    onClick={(e: React.MouseEvent) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        type="button"
      >
        ×
      </button>
    </div>
    <div className="mb-4">{children || <p>This is modal content</p>}</div>
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
);
