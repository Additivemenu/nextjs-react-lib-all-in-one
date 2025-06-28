import React, { PropsWithChildren } from "react";

import { type DropzoneOptions, type DropzoneState, useDropzone } from "react-dropzone";


interface FileDropContextType {
  getRootProps?: DropzoneState["getRootProps"];
  getInputProps?: DropzoneState["getInputProps"];
}

const FileDropContext = React.createContext<FileDropContextType>({
  getRootProps: undefined,
  getInputProps: undefined,
});

export const FileDropProvider: React.FC<PropsWithChildren & DropzoneOptions> = ({ children, ...rest }) => {

  const { getRootProps, getInputProps } = useDropzone(rest);

  return (
    <FileDropContext.Provider value={{ getInputProps, getRootProps }}>
      {children}
    </FileDropContext.Provider>
  );
};

export const useFileDrop = () => {
  return React.useContext(FileDropContext);
};
