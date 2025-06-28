import { useCallback, useEffect } from "react";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FaCaretDown } from "react-icons/fa";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { assureArray, cn } from "@/lib/utils";

import NodeConfig from "..";
import { InfoTooltip } from "../_components/info-tooltip";
import { SelectOption } from "../types";

import OptionCard from "./option-card";

interface ComboBoxProps<Value extends string | number> {
  options: SelectOption<Value>[]; // comes from dynamic column
  name: string;
  label?: string;
  selectedHeaders?: string[]; // comes from watch('name'), should always be subset of options
  placeholder?: string;
  single?: boolean;
  inGroup?: boolean;
  onClick?: () => void;
  infoTooltip?: string;
  commandEmptyRemindingText?: string;
}

export const ComboBox = <Value extends string | number>({
  name,
  options,
  label,
  selectedHeaders,
  placeholder,
  single,
  inGroup,
  onClick,
  infoTooltip,
  commandEmptyRemindingText,
  ...rest
}: ComboBoxProps<Value>) => {
  const { setValue, watch, trigger } = useFormContext();

  // Enforce selectedHeaders being a subset of options
  useEffect(() => {
    if (!selectedHeaders || !options.length) return;

    const optionValues = options.map((option) => option.value.toString());
    const validSelectedHeaders = selectedHeaders.filter((header) =>
      optionValues.includes(header),
    );

    if (validSelectedHeaders.length !== selectedHeaders.length) {
      setValue(name, validSelectedHeaders);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, name, setValue]);

  const isSelected = useCallback(
    (optionValue: Value) => {
      if (single) {
        return watch(name) === optionValue;
      } else {
        return (assureArray(watch(name)) as Value[]).includes(optionValue);
      }
    },
    [single, name, watch],
  );

  const selectSingleOption = useCallback(
    (optionValue: Value) => {
      setValue(name, isSelected(optionValue) ? null : optionValue);
    },
    [name, setValue, isSelected],
  );

  const selectMultipleOptions = useCallback(
    (optionValues: Value) => {
      // select more values after selection
      if (!isSelected(optionValues)) {
        const newOptions: Value[] = [...watch(name), optionValues];
        setValue(name, newOptions);
        return;
      }

      // deselect the values
      const remainingOptions: Value[] = (watch(name) as Value[]).filter(
        (v) => v !== optionValues,
      );
      setValue(name, remainingOptions);
    },
    [name, setValue, isSelected, watch],
  );

  const select = useCallback(
    (optionValue: Value) => {
      if (single) {
        selectSingleOption(optionValue);
      } else {
        selectMultipleOptions(optionValue);
      }
      trigger(name);
    },
    [single, selectSingleOption, selectMultipleOptions, trigger, name],
  );

  return (
    <TooltipProvider>
      <div
        role="button"
        className={cn(!inGroup && "mb-3 rounded-lg bg-background-gray p-3")}
        onClick={onClick}
        {...rest}
      >
        <div className="mb-2 flex items-center">
          <h3 className="text-sm font-bold text-primary-text">{label}</h3>
          {!!infoTooltip && (
            <InfoTooltip infoTooltip={infoTooltip} className="ml-2" />
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="btn flex h-auto !min-h-0 w-full flex-nowrap justify-between border border-border bg-white p-2 font-normal text-secondary-text hover:border-border hover:bg-white">
              <div className="flex w-[90%] flex-wrap">
                {selectedHeaders && selectedHeaders.length === 0 && (
                  <div>Select columns</div>
                )}
                {selectedHeaders &&
                  selectedHeaders.length > 0 &&
                  selectedHeaders.map((header) => (
                    <OptionCard key={header} header={header} />
                  ))}
              </div>

              <FaCaretDown className="mr-1 text-xs" />
            </button>
          </PopoverTrigger>
          <NodeConfig.ErrorMessage name={name} />
          <PopoverContent side="left">
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>
                  {commandEmptyRemindingText || "No results found"}
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option, idx) => (
                    <CommandItem
                      key={`${name}.${idx}`}
                      value={`${option.value}`}
                      onSelect={() => select(option.value)}
                      className="hover:!bg-neutral hover:!text-white"
                      data-onboarding={`option-${option.value}-${
                        isSelected(option.value) ? "selected" : "unselected"
                      }`}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(option.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="w-48 truncate text-left">
                            {option.label}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-72">
                          <p className="break-words">{option.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
};
