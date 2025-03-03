import { ReactNode } from 'react';

interface RenderIfProps {
  condition: boolean;
  children: ReactNode;
}

export const RenderIf = ({ condition, children }: RenderIfProps) => {
  if (!condition) {
    return null;
  }

  return <>{children}</>;
};
