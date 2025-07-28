"use client";

import React from "react";
import { useModal } from "./contexts";
import {
  SimpleModal,
  ConfirmModal,
  FormModal,
  type FormField,
  type SimpleModalProps,
  type ConfirmModalProps,
  type FormModalProps,
} from "./modals";
import { readmePath } from "./readme-path";
import LinkButton from "@/components/links/LinkButton";

// Demo Component
export const ModalDemo: React.FC = () => {
  const { openModal, closeAllModals, modals, closeTopModal } = useModal();
  const openSimpleModal = (): void => {
    openModal<SimpleModalProps>(SimpleModal, {
      title: `Modal ${modals.length + 1}`,
      children: (
        <div>
          <p>This is modal number {modals.length + 1}</p>
          <button
            onClick={() => openSimpleModal()}
            className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            type="button"
          >
            Open Another Modal
          </button>
        </div>
      ),
      onClose: () => {
        closeTopModal();
      },
    });
  };

  const openConfirmModal = (): void => {
    openModal<ConfirmModalProps>(ConfirmModal, {
      title: "Delete Item",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      onConfirm: () => {
        alert("Item deleted!");
      },
      onClose: () => {
        closeTopModal();
      },
    });
  };

  const openFormModal = (): void => {
    const formFields: FormField[] = [
      {
        name: "name",
        label: "Full Name",
        placeholder: "Enter your name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "Enter your age",
      },
    ];

    openModal<FormModalProps>(FormModal, {
      title: "User Registration",
      fields: formFields,
      onSubmit: (data: Record<string, string>) => {
        console.log("Form submitted:", data);
        alert(`Welcome, ${data.name}!`);
      },
      onClose: () => {
        closeTopModal();
      },
    });
  };

  const openNestedModal = (): void => {
    openModal<SimpleModalProps>(SimpleModal, {
      title: "Parent Modal",
      onClose: () => {
        closeTopModal();
      },
      children: (
        <div>
          <p>This modal can open other modals:</p>
          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={openSimpleModal}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              type="button"
            >
              Open Simple
            </button>
            <button
              onClick={openConfirmModal}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              type="button"
            >
              Open Confirm
            </button>
            <button
              onClick={openFormModal}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
              type="button"
            >
              Open Form
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Stacked Modal Manager Demo</h1>
      <LinkButton filePath={readmePath} />

      <div className="h-0.5 bg-gray-200 mt-2 mb-4" />

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Open multiple modals and see them stack on top of each other. Use ESC
          to close the top modal, or click outside to close individual modals.
        </p>
        <p className="text-sm text-gray-500">
          Currently open: <span className="font-semibold">{modals.length}</span>{" "}
          modal(s)
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={openSimpleModal}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          type="button"
        >
          Open Simple Modal
        </button>

        <button
          onClick={openConfirmModal}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          type="button"
        >
          Open Confirm Modal
        </button>

        <button
          onClick={openFormModal}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
          type="button"
        >
          Open Form Modal
        </button>

        <button
          onClick={openNestedModal}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          type="button"
        >
          Open Nested Modal
        </button>

        {modals.length > 0 && (
          <button
            onClick={closeAllModals}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            type="button"
          >
            Close All Modals
          </button>
        )}
      </div>

      {modals.length > 0 && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Modal Stack:</h3>
          <ul className="text-sm">
            {modals.map((modal, index) => (
              <li
                key={modal.id}
                className="flex justify-between items-center py-1"
              >
                <span>
                  Modal {index + 1} (z-index: {modal.zIndex})
                </span>
                <span className="text-gray-500">{modal.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
