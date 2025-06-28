import React from "react";

import { cn } from "@/lib/utils";

interface MenuTriggerProps {
  onClick: () => void;
  triggerLabel?: string;
}

export const MenuTrigger: React.FC<MenuTriggerProps> = ({ onClick, triggerLabel }) => {
  return (
    <div className={cn("flex justify-between my-2 mt-5")}>
      <div className="text-primary-text text-sm font-bold">{triggerLabel}</div>
      <div
        className={cn("cursor-pointer rounded-full hover:bg-gray")}
        onClick={onClick}
        style={{ transition: "background-color 200ms ease-in-out", backgroundColor: "#F2F2F2" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="18" height="18" rx="5" fill="none" stroke="#15b7cb" strokeWidth="1"/>
          <path d="M12 12l-2.12 2.12M12 12l-2.12-2.12M12 12h-8"
                stroke="#15b7cb"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(-45 8 8)"/>
        </svg>
      </div>
    </div>
  );
};
