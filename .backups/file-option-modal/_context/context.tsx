import { createContext } from "react";

export interface FileOptionModalContextType {
  availableHeaderOptions: string[];
  isReadingHeader: boolean;
  availableHeaderOptionErrorMessage: string;
}

export const FileOptionModalContext = createContext<FileOptionModalContextType>(
  {} as FileOptionModalContextType,
);
