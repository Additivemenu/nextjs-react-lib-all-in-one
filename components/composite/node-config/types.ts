import React from "react";

export interface SelectOption<
  Value extends NativeSelectOptionValue = undefined,
> {
  label?: string;
  value: Value;
}

export type NativeSelectOptionValue =
  | string
  | number
  | boolean
  | readonly string[]
  | undefined;

export interface TranformFunction<
  T,
  Output,
  Event extends React.SyntheticEvent,
> {
  input?: (value: T) => Output;
  output?: (event: Event) => Output;
}
