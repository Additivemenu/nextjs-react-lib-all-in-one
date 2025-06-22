"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ResizableWrapper } from "../../wrappers/resizable";

function SimpleModal({
  onClose,
  modal,
}: {
  onClose: () => void;
  modal: {
    title?: string;
    content: React.ReactNode;
  };
}) {
  return (
    <div
      className="my-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-400/50"
      // onClick={onClose}
    >
      <ResizableWrapper
        initialWidth={1600}
        initialHeight={800}
        minWidth={800}
        minHeight={600}
        maxWidth={1900}
        maxHeight={1000}
      >
        <div
          className="my-modal-content border border-1 p-4 bg-white"
          role="dialog"
          aria-modal="true"
        >
          <h2 className="text-2xl font-bold">{modal.title ?? "Modal Title"}</h2>
          {modal.content}
          <button
            className="border border-1 bg-red-300 p-2 mt-2 "
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </ResizableWrapper>
    </div>
  );
}

/**
 * https://refine.dev/blog/react-createportal/#introduction
 * @returns
 */
const SimpleModalTrigger = ({
  modal,
  triggerText = "Open modal",
}: {
  modal: {
    title?: string;
    content: React.ReactNode;
  };
  triggerText?: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button
        className="border border-1 p-2 border-rounded-md hover:bg-blue-300 text-blue-500"
        onClick={() => setShowModal(true)}
      >
        {triggerText}
      </button>
      {showModal &&
        createPortal(
          <SimpleModal onClose={() => setShowModal(false)} modal={modal} />,
          document.body,
        )}
    </div>
  );
};

export default SimpleModalTrigger;
