import React from "react";

import { useFormContext } from "react-hook-form";

import { Slider as BaseSlider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import NodeConfig from "..";
import { InfoTooltip } from "../_components/info-tooltip";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof BaseSlider> {
  name: string;
  label?: string;
  hideLabel?: boolean;
  infoTooltip?: string;
  inGroup?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  name,
  label,
  hideLabel,
  inGroup,
  infoTooltip,
  ...props
}) => {
  const { getValues, setValue } = useFormContext();
  return (
    <div className={cn(!inGroup && "mb-3 rounded-lg bg-background-gray p-3")}>
      {!hideLabel && (
        <div className="mb-2 flex items-center">
          <h3 className="text-sm font-bold text-primary-text">{label}</h3>
          {infoTooltip && (
            <InfoTooltip infoTooltip={infoTooltip} className="ml-2" />
          )}
        </div>
      )}
      <div className="flex justify-between text-sm text-secondary-text">
        <NodeConfig.InputText
          name={`${name}.0`}
          hideLabel
          inGroup
          className="w-5"
          disabled
        />
        <NodeConfig.InputText
          name={`${name}.1`}
          hideLabel
          inGroup
          className="w-5"
          disabled
        />
      </div>
      <BaseSlider
        className="mb-2"
        name={name}
        defaultValue={getValues(name)}
        onValueChange={(value) => setValue(name, value)}
        {...props}
      />
      <NodeConfig.ErrorMessage name={name} />
    </div>
  );
};
