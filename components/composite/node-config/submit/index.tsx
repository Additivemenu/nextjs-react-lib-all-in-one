import React, { HTMLProps } from "react";

import { cn } from "@/lib/utils";
import {
  useConfiguringNode,
  useWorkflowNodeConfigurationActions,
} from "@/store/workflow";

export const Submit: React.FC<HTMLProps<HTMLButtonElement>> = ({
  className,
  ...rest
}) => {
  const configNode = useConfiguringNode();
  const { addConfiguredNode } = useWorkflowNodeConfigurationActions();
  return (
    <button
      className={cn(
        "btn bordered btn-sm border-transparent bg-neutral hover:bg-accent",
        "font-semibold text-white",
        "w-full rounded-lg px-4 py-2",
        className,
      )}
      id="right-sidebar-apply-btn"
      onClick={() => {
        if (!configNode) return;
        addConfiguredNode(configNode.id);
      }}
      {...rest}
      type="submit"
    >
      Apply
    </button>
  );
};
