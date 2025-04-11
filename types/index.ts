import React from "react";

import { type FallbackProps } from "react-error-boundary";

export type Maybe<T> = T | null | undefined;

export type FCWithSkeleton<Props = NonNullable<unknown>> = React.FC<Props> & {
  Skeleton: React.FC;
  Error?: React.FC<FallbackProps>;
};

export type AnyObj = Record<string, unknown>;

export type SingleOrArray<T> = T | T[];

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
