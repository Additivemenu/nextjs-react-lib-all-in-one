import React, { ReactNode } from 'react';
import { Lock } from 'lucide-react';

// Overlay Wrapper Component
type DisableOverlayProps = {
  children: ReactNode;
  disabled?: boolean;
  message?: string;
};

const DisableOverlay = ({ 
  children, 
  disabled = false, 
  message = "Controls are currently disabled" 
}: DisableOverlayProps) => {
  return (
    <div className="relative">
      {children}
      
      {disabled && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Lock className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisableOverlay;