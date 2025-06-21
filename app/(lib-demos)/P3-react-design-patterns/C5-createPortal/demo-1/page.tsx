"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div className="my-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-400/50">
      <div
        className="my-modal-content border border-1 p-4 bg-white"
        role="dialog"
        aria-modal="true"
      >
        <p>This is the modal content</p>
        <button
          className="border border-1 bg-red-300 p-2 mt-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * https://refine.dev/blog/react-createportal/#introduction
 * @returns
 */
const Page = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button
        className="border border-1 p-2 border-rounded-md"
        onClick={() => setShowModal(true)}
      >
        Open modal.
      </button>
      {showModal &&
        createPortal(
          <Modal onClose={() => setShowModal(false)} />,
          document.body,
        )}
    </div>
  );
};

export default Page;
