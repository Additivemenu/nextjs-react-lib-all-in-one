import React, { useContext } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { MultiSelectContext } from "./MultiSelect";
import { MultiSelectOptionProps } from "./type";

const MultiSelectOption: React.FC<MultiSelectOptionProps> = ({
  value,
  children,
  highlightClass,
  shouldDisabled,
}) => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("MultiSelectOption must be used within a MultiSelect");
  }

  const { selectedValues, toggleValue } = context;
  const isSelected = selectedValues.includes(value);

  const checkBoxDaisy = (
    <input
      type="checkbox"
      disabled={shouldDisabled === undefined ? false : shouldDisabled}
      checked={isSelected}
      className="checkbox-secondary checkbox [--chkfg:white]"
      onChange={() => {
        toggleValue(value);
      }}
    />
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full" type="button">
          <div
            className={cn(
              "mb-2 flex cursor-pointer items-center rounded-lg p-2",
              highlightClass === "normal" && "bg-gray-100",
              highlightClass === "error" && "bg-red-100",
              highlightClass === "warning" && "bg-yellow-100",
            )}
          >
            {checkBoxDaisy}
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>{value}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MultiSelectOption;
