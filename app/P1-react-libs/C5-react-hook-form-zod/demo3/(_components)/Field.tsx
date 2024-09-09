// Field.js

import React from "react";

/**
 * https://claritydev.net/blog/abstract-react-form-fields-with-field-component
 *
 * @param param0
 * @returns
 */

interface FieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactElement; // FIXME: ! what is the difference between React.ReactNode and React.ReactElement ?
}

export const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => {
  const id = htmlFor || getChildId(children);

  return (
    <div className="form-field">
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {error && (
        <div role={"alert"} className="error text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

function getChildId(children: React.ReactElement) {
  const child = React.Children.only(children);

  if ("id" in child?.props) {
    return child.props.id;
  }
}
