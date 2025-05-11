import React from "react";

import Image from "next/image";
import {
  Controller,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";

import { useFileOptionModalContext } from "../../_context";
import { ExcelFormData, FileOptionFormData } from "../../form";

const CellRange = () => {
  const methods = useFormContext<FileOptionFormData>();
  const isFormValid = methods.formState.isValid;

  const { isReadingHeader } = useFileOptionModalContext();

  if (methods.getValues("fileType") !== "excel") {
    return <></>;
  }

  const excelMethods = methods as UseFormReturn<ExcelFormData>;
  const { invalid: isStartingCellInValid } =
    excelMethods.getFieldState("startingCell");
  const { invalid: isEndingCellInValid } =
    excelMethods.getFieldState("endingCell");

  return (
    <div>
      <div className="">
        <h3 className="mb-2 flex font-bold text-secondary-text">
          Cell Range
          <div
            className="tooltip my-auto ml-2"
            data-tip="Set the range of cells to import."
          >
            <Image src="/info-thin.svg" alt="Info" width={20} height={20} />
          </div>
        </h3>
        {/* check box input */}
        <div className="mb-2 flex pl-2">
          <div
            className="tooltip my-auto"
            data-tip="Toggle to import specific cell range; all cells imported when off."
          >
            <Controller
              name="isCellRangeCheckboxOn"
              control={methods.control}
              render={({ field }) => {
                return (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isReadingHeader}
                  />
                );
              }}
            />
          </div>
        </div>
        {/* cell range input */}
        <div className="flex pl-2">
          {methods.watch("isCellRangeCheckboxOn") && (
            <div>
              <Controller
                name="startingCell"
                control={methods.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    disabled={isReadingHeader}
                    placeholder="A2"
                    className="mr-1 w-10 rounded-lg border border-border-2 px-1 py-0.5"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value); // pass input value to react hook form

                      setTimeout(() => {
                        // force to trigger field validation so that form error state can be updated immediately
                        methods.trigger("headerRowNumber");
                        methods.trigger("endingCell");
                      }, 500);
                    }}
                  />
                )}
              />{" "}
              :{" "}
              <Controller
                name="endingCell"
                control={methods.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    disabled={isReadingHeader}
                    placeholder="E11"
                    className="mr-1 w-10 rounded-lg border border-border-2 px-1 py-0.5"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);

                      setTimeout(() => {
                        methods.trigger("headerRowNumber");
                        methods.trigger("startingCell");
                      }, 500);
                    }}
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>

      {excelMethods.watch("isCellRangeCheckboxOn") &&
        isStartingCellInValid &&
        !isFormValid && (
          <div className="mt-2">
            <p className="text-xs text-red-500">
              {excelMethods.formState.errors.startingCell?.message}
            </p>
          </div>
        )}

      {excelMethods.watch("isCellRangeCheckboxOn") &&
        isEndingCellInValid &&
        !isFormValid && (
          <div className="mt-2">
            <p className="text-xs text-red-500">
              {excelMethods.formState.errors.endingCell?.message}
            </p>
          </div>
        )}
    </div>
  );
};

export default CellRange;
