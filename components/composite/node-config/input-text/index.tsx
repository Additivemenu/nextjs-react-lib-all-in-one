import React from "react";

import {
  Controller,
  type FieldValues,
  type UseFormTrigger,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import NodeConfig, { TranformFunction } from "..";
import { InfoTooltip } from "../_components/info-tooltip";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  inGroup?: boolean;
  hideLabel?: boolean;
  infoTooltip?: string;
  transform?: TranformFunction<
    string,
    unknown,
    React.ChangeEvent<HTMLInputElement>
  >;
  trigger?: UseFormTrigger<FieldValues>;
  onChangeCallback?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText: React.FC<InputTextProps> = ({
  label = "Input",
  inGroup = false,
  hideLabel,
  infoTooltip,
  name,
  transform,
  trigger,
  onChangeCallback,
  ...rest
}) => {
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
      <Controller
        name={name}
        defaultValue={rest.defaultValue}
        render={({ field }) => (
          <input
            className="input input-sm mb-2 w-full border-border bg-white text-secondary-text"
            {...field}
            onChange={(e) => {
              field.onChange(transform?.output?.(e) ?? e);
              trigger?.();
              onChangeCallback?.(e);
            }}
            value={transform?.input?.(field.value) ?? field.value}
            {...rest}
          />
        )}
      />
      <NodeConfig.ErrorMessage name={name} />
    </div>
  );
};
