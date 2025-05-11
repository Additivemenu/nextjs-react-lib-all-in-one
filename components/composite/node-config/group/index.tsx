import React, { HTMLProps, PropsWithChildren } from "react";

interface GroupProps extends PropsWithChildren {
  label?: React.ReactNode;
}

export const Group: React.FC<
  GroupProps & Omit<HTMLProps<HTMLDivElement>, "label">
> = ({ children, label, ...rest }) => {
  return (
    <div
      className="p-3 mb-3 bg-background-gray rounded-lg flex flex-col gap-y-2"
      pf-onboarding-id="right-sidebar-node-config-group"
      {...rest}
    >
      {label && <h3 className="text-primary-text font-bold">{label}</h3>}
      {children}
    </div>
  );
};
