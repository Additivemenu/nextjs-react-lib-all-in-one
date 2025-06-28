import React, { useCallback, useState } from "react";

import _ from "lodash";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import { useFileOptionModalContext } from "../../_context";
import { FileOptionFormData } from "../../form";

const HeaderRow = () => {
  const methods = useFormContext<FileOptionFormData>();

  const [localValue, setLocalValue] = useState<string>(() => {
    return methods.getValues("headerRowNumber").toString() ?? "1";
  });
  const { isReadingHeader } = useFileOptionModalContext();

  const debouncedOnChange = useCallback(
    _.debounce((value: number, onChange: (value: number) => void) => {
      onChange(value);
    }, 800), // 500ms delay
    [], // Empty dependencies array since we want this to be created only once
  );

  return (
    <div>
      <h3 className="mb-2 flex font-bold text-secondary-text">
        Column Headers
        <div
          className="tooltip my-auto ml-2"
          data-tip="Choose the row with column names."
        >
          <Image src="/info-thin.svg" alt="Info" width={20} height={20} />
        </div>
      </h3>
      <div className="pl-2">
        The row
        <Controller
          name="headerRowNumber"
          control={methods.control}
          render={({ field }) => (
            <input
              {...field}
              value={localValue}
              disabled={isReadingHeader}
              type="number"
              placeholder="1"
              min={1}
              className="show-arrows w-10 rounded-md border border-border-2 px-1 py-0.5"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                setLocalValue(newValue); // update what user sees in the UI

                // !update react hook form internal field (user does not see it directly) -> which triggers recalculation of column selection
                if (newValue === "") {
                  field.onChange(1); // Keep form value as 1 even when input is empty
                } else {
                  const value = Number(newValue);
                  debouncedOnChange(value, field.onChange);
                }

                // force to trigger field validation so that the form error state can be updated immediately
                methods.trigger("startingCell");
                methods.trigger("endingCell");
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setLocalValue("1");
                  field.onChange(1);
                }
                field.onBlur();
              }}
            />
          )}
        />
        as header
      </div>

      {methods.formState.errors.headerRowNumber &&
        !methods.formState.isValid && (
          <div className="mt-2">
            <p className="text-xs text-red-500">
              {methods.formState.errors.headerRowNumber?.message}
            </p>
          </div>
        )}
    </div>
  );
};

export default HeaderRow;
