"use client";
import React, { PropsWithChildren } from "react";

import { type DropzoneOptions } from "react-dropzone";

import { FileDropProvider, useFileDrop } from "./context";

interface FileDropContainerProps extends DropzoneOptions {
  containerProps?: React.HTMLProps<HTMLDivElement>;
}

export const FileDrop = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement>
>(({ ...rest }, ref) => {
  const { getInputProps } = useFileDrop();

  if (!getInputProps) {
    return null;
  }

  return <input type="file" ref={ref} {...getInputProps()} {...rest} />;
});

FileDrop.displayName = "FileDrop";

const Container: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  const { getRootProps } = useFileDrop();

  if (!getRootProps) {
    return null;
  }

  return (
    <div {...getRootProps()} {...rest}>
      {children}
    </div>
  );
};

export const FileDropContainer: React.FC<
  PropsWithChildren & FileDropContainerProps
> = ({ children, containerProps, ...rest }) => {
  return (
    <FileDropProvider {...rest}>
      <Container {...containerProps}>{children}</Container>
    </FileDropProvider>
  );
};
