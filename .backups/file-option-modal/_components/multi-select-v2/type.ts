// type.ts
import type { Control, FieldPath, FieldValues } from "react-hook-form";

// root component props
export type MultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  children: React.ReactNode;
  name: TName;
  control: Control<TFieldValues>;
  className?: string;
};

// inner component props
export type MultiSelectOptionProps = {
  value: string;
  children: React.ReactNode;
  highlightClass: "warning" | "error" | "normal";
  shouldDisabled?: boolean;
};

// context type
export type MultiSelectContextType = {
  selectedValues: string[];
  toggleValue: (value: string) => void;
} | null;
