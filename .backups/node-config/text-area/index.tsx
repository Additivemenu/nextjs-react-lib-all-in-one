import React from "react";

import {
  Controller,
  type FieldValues,
  type UseFormTrigger,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import NodeConfig, { TranformFunction } from "..";
import { InfoTooltip } from "../_components/info-tooltip";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  inGroup?: boolean;
  hideLabel?: boolean;
  infoTooltip?: string;
  disabled?: boolean;
  transform?: TranformFunction<
    string,
    unknown,
    React.ChangeEvent<HTMLTextAreaElement>
  >;
  trigger?: UseFormTrigger<FieldValues>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label = "Input",
  inGroup = false,
  hideLabel,
  infoTooltip,
  disabled = false,
  name,
  transform,
  trigger,
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
          <textarea
            className={cn(
              "input input-sm mb-2 max-h-[600px] min-h-[150px] w-full border-border bg-white leading-relaxed text-secondary-text",
              disabled && "cursor-not-allowed !bg-white !text-slate-400 !border-slate-200",
            )}
            rows={30}
            cols={40}
            disabled={disabled}
            {...field}
            onChange={(e) => {
              field.onChange(transform?.output?.(e) ?? e);
              trigger?.();
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
