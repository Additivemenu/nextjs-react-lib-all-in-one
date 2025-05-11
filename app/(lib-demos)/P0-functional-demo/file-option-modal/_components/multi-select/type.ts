// root component props
export type MultiSelectProps = {
  children: React.ReactNode;
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  className?: string;
};

// inner component props
export type MultiSelectOptionProps = {
  value: string;
  children: React.ReactNode;
};

// context type
export type MultiSelectContextType = {
  selectedValues: string[];
  toggleValue: (value: string) => void;
} | null;
