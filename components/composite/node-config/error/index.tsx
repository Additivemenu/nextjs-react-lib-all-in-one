import React, { HTMLProps } from "react";

import { type FieldErrors, useFormContext } from "react-hook-form";

interface ErrorMessageProps extends HTMLProps<HTMLParagraphElement> {
  name: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ name }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const nameParts = name.split(".");
  let error: FieldErrors = errors;
  for (const part of nameParts) {
    error = error?.[part] as FieldErrors;
  }
  const message = error?.message ?? error?.root?.message;

  return (
    <p className="text-xs text-error">{message as string}</p>
  );
};
