import React, { HTMLProps } from "react";

import { cn } from "@/lib/utils";

export const Title: React.FC<HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between m-4",
          "text-secondary-text font-bold",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
      <div className="w-full border-b border-border-2" />
    </>
  );
};
