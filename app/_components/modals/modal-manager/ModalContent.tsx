"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "./ModalManagerContext";

interface ModalContentProps {
  id: string;
  children: React.ReactNode;
  /**
   * Optional callback when the backdrop is clicked
   */
  onBackdropClick?: () => void;
  /**
   * Whether clicking the backdrop should close the modal
   * @default true
   */
  closeOnBackdropClick?: boolean;
  /**
   * Optional className for the modal container
   */
  className?: string;
}

/**
 * ModalContent Component
 *
 * Renders modal content with backdrop and proper stacking.
 * Automatically mounts to document.body using React Portal.
 * Only renders when the modal is open.
 *
 * @example
 * ```tsx
 * <ModalContent id="my-modal">
 *   <div className="p-4 bg-white rounded">
 *     <h2>Modal Title</h2>
 *     <p>Modal content here</p>
 *   </div>
 * </ModalContent>
 * ```
 */
export const ModalContent: React.FC<ModalContentProps> = ({
  id,
  children,
  onBackdropClick,
  closeOnBackdropClick = true,
  className = "",
}) => {
  const { isModalOpen, closeModal, activeModalIds } = useModal();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key to close the topmost modal
  useEffect(() => {
    if (!isModalOpen(id)) return;

    const handleEscape = (e: KeyboardEvent) => {
      // Only close if this is the topmost modal
      const isTopmost = activeModalIds[activeModalIds.length - 1] === id;
      if (e.key === "Escape" && isTopmost) {
        closeModal(id);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [id, isModalOpen, closeModal, activeModalIds]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen(id)) {
      // Store original overflow style
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        // Only restore if no other modals are open
        if (activeModalIds.length === 1) {
          document.body.style.overflow = originalOverflow;
        }
      };
    }
  }, [isModalOpen, id, activeModalIds.length]);

  if (!mounted || !isModalOpen(id)) {
    return null;
  }

  // Calculate z-index based on position in the stack
  const modalIndex = activeModalIds.indexOf(id);
  const zIndex = 1000 + modalIndex * 10;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //! Only close if clicking directly on the backdrop, not its children
    if (e.target === e.currentTarget) {
      if (closeOnBackdropClick) {
        closeModal(id);
      }
      onBackdropClick?.();
    }
  };

  const modalElement = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 ${className}`}
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-${id}`}
      aria-label={`modal${id} backdrop`}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-auto"
        aria-label={`modal${id} container`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};
