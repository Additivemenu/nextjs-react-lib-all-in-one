import React from "react";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { InfoTooltip } from "../_components/info-tooltip";

interface ToggleProps {
  name: string;
  label?: React.ReactNode;
  infoTooltip?: string;
  inGroup?: boolean;
  variant?: "checkbox" | "toggle";
}

const toggleStyle = {
  toggle: {
    on: "[--tglbg:#15b7cb] bg-white",
    off: "[--tglbg:#f7f8fa] bg-neutral",
  },
  checkbox: {
    on: "[--chkbg:#15b7cb] [--chkfg:white]",
    off: "[--chkbg:#f7f8fa] bg-gray-200",
  },
};

export const Toggle: React.FC<ToggleProps> = ({
  name,
  label,
  infoTooltip,
  inGroup,
  variant = "toggle",
}) => {
  const { register, watch } = useFormContext();

  return (
    <div className={cn(!inGroup && "flex justify-between my-2")}>
      {label && (
        <div className="flex items-center">
          <div className="text-primary-text text-sm font-bold">{label}</div>
          {infoTooltip && (
            <InfoTooltip infoTooltip={infoTooltip} className="ml-2" />
          )}
        </div>
      )}

      <input
        type="checkbox"
        className={cn(
          variant,
          watch(name) ? toggleStyle[variant].on : toggleStyle[variant].off,
        )}
        {...register(name)}
      />
    </div>
  );
};
