// MultiSelect.tsx
import React, { createContext } from "react";

import {
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import MultiSelectOption from "./MultiSelectOption";
import { MultiSelectContextType, MultiSelectProps } from "./type";

export const MultiSelectContext = createContext<MultiSelectContextType>(null);

/**
 * integrate with react-hook-form
 *
 * @param param0
 * @returns
 */
const MultiSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  name,
  control,
  className,
}: MultiSelectProps<TFieldValues, TName>) => {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  }); // ! this connects the hook form to the MultiSelect component

  const toggleValue = (optionValue: string) => {
    const newValues = (value as string[]).includes(optionValue)
      ? (value as string[]).filter((v) => v !== optionValue)
      : [...(value as string[]), optionValue];

    onChange(newValues); // this updates the form
  };

  return (
    <MultiSelectContext.Provider
      value={{ selectedValues: value as string[], toggleValue }}
    >
      <div className={`rounded-lg p-2 ${className}`}>{children}</div>
    </MultiSelectContext.Provider>
  );
};

// Attach the Option component to the MultiSelect component
MultiSelect.Option = MultiSelectOption;

export default MultiSelect;
