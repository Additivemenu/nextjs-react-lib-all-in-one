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
      checked={isSelected}
      className="checkbox checkbox-secondary [--chkfg:white]"
      onChange={() => {
        toggleValue(value);
      }}
    />
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <div
            className={cn(
              "flex items-center p-2 mb-2 cursor-pointer rounded-lg",
              "bg-gray-100"
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
