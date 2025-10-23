/**
 * Modal Manager Demo
 *
 * This file demonstrates how to use the modal manager system.
 */

"use client";

import React from "react";
import { Modal, ModalContent, useModal } from "./index";

function ModalControls() {
  const { openModal, closeAllModals } = useModal();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Modal Manager Demo</h1>

      <div className="flex gap-4">
        <button
          onClick={() => openModal("modal1")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Modal 1
        </button>

        <button
          onClick={() => openModal("modal2")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Open Modal 2
        </button>

        <button
          onClick={closeAllModals}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close All Modals
        </button>
      </div>
    </div>
  );
}

function Modal1Content() {
  const { openModal, closeModal } = useModal();

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
      <h2 className="text-xl font-bold mb-4">Modal 1</h2>
      <p className="mb-4">
        This is the first modal. You can open another modal on top of this one.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => openModal("modal2")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Open Modal 2
        </button>

        <button
          onClick={() => closeModal("modal1")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Modal2Content() {
  const { openModal, closeModal } = useModal();

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
      <h2 className="text-xl font-bold mb-4">Modal 2</h2>
      <p className="mb-4">
        This is the second modal. It stacks on top of Modal 1 if it&apos;s open.
        Press ESC to close this modal, or click the backdrop.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => openModal("modal3")}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Open Modal 3
        </button>

        <button
          onClick={() => closeModal("modal2")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Modal3Content() {
  const { closeModal, closeAllModals } = useModal();

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
      <h2 className="text-xl font-bold mb-4">Modal 3</h2>
      <p className="mb-4">
        Third level modal! This demonstrates that modals can stack multiple
        levels deep.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => closeModal("modal3")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close This Modal
        </button>

        <button
          onClick={closeAllModals}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close All
        </button>
      </div>
    </div>
  );
}

/**
 * the beauty of this composite component is that
 * we can declare the ModalContent anywhere down in the sub tree of <Modal> </Modal>, -- thanks to createPortal
 * and we just need to use openModal(id) to manage which one to open
 *
 * @returns
 */
export default function ModalDemo() {
  return (
    <Modal>
      <ModalControls />

      {/* Modal 1 */}
      <ModalContent id="modal1">
        <Modal1Content />
      </ModalContent>

      {/* Modal 2 */}
      <ModalContent id="modal2">
        <Modal2Content />
      </ModalContent>

      {/* Modal 3 - Demonstrates 3-level stacking */}
      <ModalContent id="modal3">
        <Modal3Content />
      </ModalContent>
    </Modal>
  );
}
