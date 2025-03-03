import { ReactNode } from "react";

interface RenderIfProps {
  condition: boolean;
  children: ReactNode;
}

/**
 * wrapper component to conditionally render a component
 *
 * @param param0
 * @returns
 */
export const RenderIf = ({ condition, children }: RenderIfProps) => {
  if (!condition) {
    return null;
  }

  return <>{children}</>;
};
