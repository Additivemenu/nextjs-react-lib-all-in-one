"use client";

import React, { useState } from "react";

import { useFormInternalStateUpdatesEffect } from "./_hooks/use-form-internal-state-updates-effect";
import { useValidateAvailableHeaderOptionsEffect } from "./_hooks/use-validate-available-header-effect";
import { FileOptionModalContext } from "./context";

interface FileOptionModalProviderProps {
  children: React.ReactNode;
  fileToUpload: File;
}

export const FileOptionModalProvider: React.FC<
  FileOptionModalProviderProps
> = ({ fileToUpload, children }) => {
  const [availableHeaderOptions, setAvailableHeaderOptions] = useState<
    string[]
  >([]);

  const { availableHeaderOptionErrorMessage } =
    useValidateAvailableHeaderOptionsEffect(availableHeaderOptions);

  // complex form state dependency update logic is resolved in this effect hook
  const { isReadingHeader } = useFormInternalStateUpdatesEffect(
    fileToUpload,
    setAvailableHeaderOptions,
  );

  return (
    <FileOptionModalContext.Provider
      value={{
        availableHeaderOptions,
        isReadingHeader,
        availableHeaderOptionErrorMessage,
      }}
    >
      {children}
    </FileOptionModalContext.Provider>
  );
};
