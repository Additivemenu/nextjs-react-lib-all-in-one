import React, { createContext } from "react";

import MultiSelectOption from "./MultiSelectOption";
import {
  MultiSelectContextType,
  MultiSelectOptionProps,
  MultiSelectProps,
} from "./type";

export const MultiSelectContext = createContext<MultiSelectContextType>(null);

/**
 * compound components root, also context provider
 */
const MultiSelect: React.FC<MultiSelectProps> & {
  Option: React.FC<MultiSelectOptionProps>;
} = ({ children, selectedValues, setSelectedValues, className }) => {
  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newValues);
  };

  return (
    <MultiSelectContext.Provider value={{ selectedValues, toggleValue }}>
      <div className={`rounded-lg p-2 ${className}`}>{children}</div>
    </MultiSelectContext.Provider>
  );
};

// Attach the Option component to the MultiSelect component
MultiSelect.Option = MultiSelectOption;

export default MultiSelect;
