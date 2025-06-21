"use client";

import React, { ReactNode } from "react";
import { BaseModalProps } from ".";

// Form field interface
export interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

// Form Modal Component Props
export interface FormModalProps extends BaseModalProps {
  onSubmit?: (data: Record<string, string>) => void;
  title?: string;
  fields?: FormField[];
}

// Form Modal Component
export const FormModal: React.FC<FormModalProps> = ({
  onClose,
  onSubmit,
  title = "Form",
  fields = [],
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    onSubmit?.(data);
    onClose();
  };

  return (
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
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
