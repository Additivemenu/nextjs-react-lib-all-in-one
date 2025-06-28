import React from "react";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from "uuid";

import { useFileOptionModalContext } from "../../_context";
import { FileOptionFormData } from "../../form";
import MultiSelect from "../multi-select-v2/MultiSelect";

const ColumnSelection = () => {
  const methods = useFormContext<FileOptionFormData>();

  const {
    availableHeaderOptions,
    isReadingHeader,
    availableHeaderOptionErrorMessage,
  } = useFileOptionModalContext();

  const handleSelectAllAvailableHeaders = () => {
    methods.setValue("selectedHeaders", availableHeaderOptions, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <p className="font-bold text-secondary-text"> Column Selection</p>
          <div
            className="tooltip my-auto ml-2"
            data-tip="Select columns to include."
          >
            <Image src="/info-thin.svg" alt="Info" width={20} height={20} />
          </div>
        </div>

        <button
          disabled={isReadingHeader}
          className="btn bordered btn-sm rounded-lg border-transparent bg-neutral px-2 py-1 text-sm font-semibold text-white hover:bg-accent"
          data-onboarding="upload-file-step-4"
          onClick={handleSelectAllAvailableHeaders}
          type="button"
        >
          Select All
        </button>
      </div>

      <div className="mt-2 rounded-2xl bg-white p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        {isReadingHeader && (
          <div className="mt-5 flex min-h-[300px] flex-col items-center justify-center">
            <div className="loading loading-spinner loading-lg text-neutral" />
            <p className="mt-4 text-lg font-medium text-primary-text">
              Loading headers ...
            </p>
          </div>
        )}
        {!isReadingHeader && availableHeaderOptions.length === 0 && (
          <div className="min-h-[300px]">Oops, no headers found!</div>
        )}
        {!isReadingHeader && availableHeaderOptions.length > 0 && (
          <MultiSelect
            name="selectedHeaders"
            control={methods.control}
            className="max-h-[300px] overflow-y-auto"
          >
            {availableHeaderOptions.map((header) => {
              if (header === null || header === undefined) return null;

              const isDuplicated =
                availableHeaderOptions.filter((h) => h === header).length > 1;
              const isEmpty = header === "";
              const isUnnamed = header.startsWith("Unnamed");

              let highlightClass: "warning" | "error" | "normal" = "normal";
              if (isDuplicated) {
                highlightClass = "error";
              } else if (isEmpty || isUnnamed) {
                highlightClass = "warning";
              } else {
                highlightClass = "normal";
              }

              return (
                <MultiSelect.Option
                  key={uuidv4()}
                  value={header}
                  highlightClass={highlightClass}
                  shouldDisabled={isDuplicated}
                >
                  <div className="ml-auto p-2 text-sm">
                    {header?.length > 15 ? header.slice(0, 15) + "..." : header}
                  </div>
                </MultiSelect.Option>
              );
            })}
          </MultiSelect>
        )}
      </div>

      {availableHeaderOptionErrorMessage && (
        <div className="mt-2">
          <p className="text-xs text-red-500">
            {availableHeaderOptionErrorMessage}
          </p>
        </div>
      )}

      {!availableHeaderOptionErrorMessage &&
        methods.formState.errors.selectedHeaders && (
          <div className="mt-2">
            <p className="text-xs text-red-500">
              {methods.formState.errors.selectedHeaders?.message}
            </p>
          </div>
        )}
    </>
  );
};

export default ColumnSelection;
