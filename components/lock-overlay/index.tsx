import React, { ReactNode } from "react";

import { Lock } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Overlay Wrapper Component
type LockOverlayProps = {
  children: ReactNode;
  shouldLock?: boolean;
  message?: string;
  config?: {
    showLockIcon: boolean;
  };
};

const LockOverlay = ({
  children,
  shouldLock = false,
  config = {
    showLockIcon: false,
  },
  message,
}: LockOverlayProps) => {
  if (!shouldLock) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative h-full cursor-default">
            {children}

            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-lg",
                "bg-white/60 backdrop-blur-[1px]", // blur out
                "blur-out-overlay"
              )}
            >
              {config.showLockIcon && (
                <div className="space-y-2 text-center">
                  <Lock className="mx-auto h-8 w-8 text-slate-800" />
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        {message && (
          <TooltipContent align="end" className="max-w-96">
            {message}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default LockOverlay;
