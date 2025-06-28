"use client";

import React, { FC, useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

import { MenuTrigger } from "../menu-item/index";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = DialogPrimitive.Overlay;
const DialogContent = DialogPrimitive.Content;
const DialogTitle = DialogPrimitive.Title;

interface ConfigDialogProps {
  triggerLabel?: string;
  children: React.ReactNode;
}

export const ConfigDialog: FC<ConfigDialogProps> = ({ children, triggerLabel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <MenuTrigger onClick={() => handleOpenChange(true)} triggerLabel={triggerLabel}></MenuTrigger>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={cn("fixed inset-0 bg-black/30 z-20")} />
        <DialogContent
          className={cn(
            "fixed top-1/2 left-1/2 max-w-3xl w-full bg-white shadow-lg rounded-lg",
            "transform -translate-x-1/2 -translate-y-1/2 z-20 p-8"
          )}
        >
          <DialogTitle className={cn("text-primary-text text-lg font-bold")}>{triggerLabel}</DialogTitle>
          <div className={cn("mt-4")}>
            {children}
          </div>
          <div className={cn("flex justify-end gap-2 mt-4")}>
            <button
              onClick={() => handleOpenChange(false)}
              className={cn(
                "px-4 py-2 rounded border border-gray-300 shadow-sm text-gray-700",
                "bg-white hover:bg-gray-50"
              )}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
