import React from "react";

import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import { RenderIf } from "@/components/render-if";
import { cn } from "@/lib/utils";
import { Maybe } from "@/types";

import NodeConfig from "..";
import { InfoTooltip } from "../_components/info-tooltip";
import {
  NativeSelectOptionValue,
  SelectOption,
  TranformFunction,
} from "../types";

import { ToTransformationVisualsSVG } from "./icons";




interface SelectProps<Value extends NativeSelectOptionValue> {
  options: SelectOption<Value>[];
  name: string;
  selectedOptions?: Value[]; // to filter out selected options from options
  fieldIndex?: Maybe<number>; // each select is associated with a field array index
  label?: string;
  hideLabel?: boolean;
  inGroup?: boolean;
  transform?: TranformFunction<
    string,
    unknown,
    React.ChangeEvent<HTMLSelectElement>
  >;
  onChange?: (value: Value) => void;
  disabled?: boolean;
  infoIconCallback?: () => void; // normally used to open transformation visuals guide for method options select
  infoTooltip?: string; // normally used to show tooltip for method parameter option
}

export const Select = <Value extends NativeSelectOptionValue>({
  options,
  name,
  selectedOptions,
  fieldIndex,
  onChange,
  inGroup,
  hideLabel,
  transform,
  label = "Options",
  disabled,
  infoIconCallback,
  infoTooltip,
}: SelectProps<Value>) => {
  const { trigger } = useFormContext();

  const getFilteredOptions = (fieldIndex: Maybe<number>) => {
    if (!selectedOptions || (!fieldIndex && fieldIndex !== 0)) return options;
    return options.filter(
      (option) =>
        !selectedOptions.includes(option.value) ||
        selectedOptions[fieldIndex] === option.value
    );
  };

  return (
    <div className={cn(!inGroup && "p-3 mb-3 bg-background-gray rounded-lg")}>
      {!hideLabel && (
        <div className="flex mb-2 items-center space-x-2">
          <h3 className="text-primary-text text-sm font-bold">{label}</h3>
          {!!infoTooltip && (
            <InfoTooltip infoTooltip={infoTooltip} className="ml-2" />
          )}
          <RenderIf condition={!!infoIconCallback}>
            <button
              type="button"
              onClick={() => {
                infoIconCallback?.();
              }}
              className="btn btn-sm bg-background-gray rounded hover:bg-ghost-hover border-none size-8 p-0"
            >
              <Image
                src={ToTransformationVisualsSVG}
                alt="Open Transformation Visuals Guide"
                width={20}
                height={20}
              />
            </button>
          </RenderIf>
        </div>
      )}
      <Controller
        name={name}
        render={({ field }) => (
          <select
            className="select select-sm border border-border bg-white text-secondary-text w-full mb-1"
            {...field}
            onChange={(e) => {
              field.onChange(transform?.output?.(e) ?? e);
              trigger(name);
              onChange?.(e.target.value as Value);
            }}
            value={transform?.input?.(field.value) ?? field.value}
            disabled={disabled}
          >
            <option disabled value="">Choose Option</option>
            {getFilteredOptions(fieldIndex).map((option, idx) => (
              <option key={`${name}-${idx}`} value={option.value as string}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        )}
      />
      <NodeConfig.ErrorMessage name={name} />
    </div>
  );
};
