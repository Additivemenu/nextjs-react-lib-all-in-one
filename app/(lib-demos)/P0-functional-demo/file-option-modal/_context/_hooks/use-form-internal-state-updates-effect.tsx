import { useCallback, useEffect, useState } from "react";

import { useFormContext } from "react-hook-form";

import { log } from "@/lib/log";
import { useGetUploadInStore } from "@/store/workflow/add-file-modal/hooks";

import { readHeaderValuesAsync } from "../../../../utils/";
import { removeAllDuplicates } from "../../_utils/remove-all-duplicates";
import {
  FileOptionFormData,
  getColumnIndexBound,
  isCellValid,
} from "../../form";

export const useFormInternalStateUpdatesEffect = (
  fileToUpload: File,
  setAvailableHeaderOptions: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const methods = useFormContext<FileOptionFormData>();
  const headerRowNumber = methods.watch("headerRowNumber");
  const isCellRangeCheckboxOn = methods.watch("isCellRangeCheckboxOn");
  const startingCell = methods.watch("startingCell");
  const endingCell = methods.watch("endingCell");

  const uploadInStore = useGetUploadInStore(fileToUpload);

  const [isReadingHeader, setIsReadingHeader] = useState<boolean>(false);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true); // when file option modal is opened (even if it is re-opened), this is initialized as true
  log("isInitialLoading in file option modal: ", isInitialLoading);

  // ! ================== CSV File ==================
  const updateOnHeaderRowNumberChangeForCSVFile = useCallback(
    async () => {
      if (methods.getValues("fileType") !== "csv") {
        return;
      }

      setIsReadingHeader(true);
      const newFullHeaderOptions = await readHeaderValuesAsync(
        fileToUpload,
        headerRowNumber,
      );
      setIsReadingHeader(false);
      setAvailableHeaderOptions(newFullHeaderOptions);
      log(
        "update csv header options, the new full header options:",
        newFullHeaderOptions,
      );

      if (!uploadInStore?.isConfigured) {
        // user first time config the fileToUpload, the selectedHeaders should be the same as the fullHeaderOptions on headerRowNumber change
        methods.setValue(
          "selectedHeaders",
          removeAllDuplicates(newFullHeaderOptions),
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          },
        );
      } else {
        // user opens the file option modal again for the fileToUpload, and the initial selectedHeaders should be the same as the previous one -> load it from the store
        if (isInitialLoading) {
          const prevSelectedHeaders = JSON.parse(
            uploadInStore.useCols,
          ) as string[];
          methods.setValue(
            "selectedHeaders",
            removeAllDuplicates(prevSelectedHeaders),
            {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            },
          );
          setIsInitialLoading(false);
          return;
        }
        // if not initial loading, then should set fullHeaderOptions to the selectedHeaders when headerRowNumber changes
        methods.setValue(
          "selectedHeaders",
          removeAllDuplicates(newFullHeaderOptions),
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          },
        );
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headerRowNumber],
  );

  // ! ================== Excel File ==================
  const getFilteredAvailableHeaderOptions = useCallback(
    async (
      headerRowNumber: number,
      startingCell: string,
      endingCell: string,
    ) => {
      const {
        leftBoundIndex: startingColIndex,
        rightBoundIndex: endingColIndex,
      } = getColumnIndexBound({
        startingCell,
        endingCell,
      });

      if (startingColIndex === -1 || endingColIndex === -1) {
        return;
      }

      setIsReadingHeader(true);
      const newFullHeaderOptions = await readHeaderValuesAsync(
        fileToUpload,
        headerRowNumber,
      );
      setIsReadingHeader(false);
      const filteredAvailableHeaderOptions = newFullHeaderOptions.slice(
        startingColIndex,
        endingColIndex + 1,
      );

      return filteredAvailableHeaderOptions;
    },
    [fileToUpload],
  );

  const updateOnDependencyChangeForExcelFile = useCallback(
    async () => {
      if (methods.getValues("fileType") !== "excel") {
        return;
      }

      if (!uploadInStore?.isConfigured) {
        // user first time config the fileToUpload -----------------------------------------------

        // ! since we are accessing the field value using watch(), so it is not guaranteed that the field value here is valid
        if (!isCellValid(startingCell) || !isCellValid(endingCell)) {
          return;
        }

        if (isCellRangeCheckboxOn && startingCell && endingCell) {
          // if cell range is on, then filter the fullHeaderOptions based on the column range

          const filteredAvailableHeaderOptions =
            (await getFilteredAvailableHeaderOptions(
              headerRowNumber,
              startingCell,
              endingCell,
            )) as string[];

          // 1. update availableHeaderOptions
          setAvailableHeaderOptions(filteredAvailableHeaderOptions);

          // 2. update selectedHeaders in the form
          // if triggered by change of cell range -> need a further filter based on the filteredAvailableHeaderOptions
          // if triggered by change of headerRowNumber -> no need to further filter based on the filteredAvailableHeaderOptions
          // but it is not elegant to have this logic in the useEffect,  as it would need a ref to store previous form states
          // FIXME:
          const previousSelectedHeaders = methods.getValues("selectedHeaders");
          const newSelectedHeaders = filteredAvailableHeaderOptions.filter(
            (header) => previousSelectedHeaders.includes(header),
          );
          methods.setValue(
            "selectedHeaders",
            removeAllDuplicates([...newSelectedHeaders]),
            {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            },
          );
        } else {
          // otherwise, the cellRange is off, so no need to filter the fullHeaderOptions -> handle it just like csv file
          setIsReadingHeader(true);
          const newFullHeaderOptions = await readHeaderValuesAsync(
            fileToUpload,
            headerRowNumber,
          );
          setIsReadingHeader(false);

          // 1. update availableHeaderOptions
          setAvailableHeaderOptions(newFullHeaderOptions);

          // 2. update selectedHeaders in the form
          // user first time config the fileToUpload, the selectedHeaders should be the same as the fullHeaderOptions on headerRowNumber change
          methods.setValue(
            "selectedHeaders",
            removeAllDuplicates(newFullHeaderOptions),
            {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            },
          );
        }
      } else {
        // user re-open the file option modal for the fileToUpload -------------------------------------

        if (isInitialLoading) {
          // set availableHeaders based on initialForm values parsed from store
          if (!isCellValid(startingCell) || !isCellValid(endingCell)) {
            return;
          }

          if (isCellRangeCheckboxOn && startingCell && endingCell) {
            const filteredAvailableHeaderOptions =
              (await getFilteredAvailableHeaderOptions(
                headerRowNumber,
                startingCell,
                endingCell,
              )) as string[];

            setAvailableHeaderOptions(filteredAvailableHeaderOptions);
          } else {
            setIsReadingHeader(true);
            const newFullHeaderOptions = await readHeaderValuesAsync(
              fileToUpload,
              headerRowNumber,
            );
            setIsReadingHeader(false);
            setAvailableHeaderOptions(newFullHeaderOptions);
          }

          setIsInitialLoading(false);
        } else {
          // not initial loading

          if (!isCellValid(startingCell) || !isCellValid(endingCell)) {
            return;
          }

          if (isCellRangeCheckboxOn && startingCell && endingCell) {
            // if cell range is on, then filter the fullHeaderOptions based on the column range
            const filteredAvailableHeaderOptions =
              (await getFilteredAvailableHeaderOptions(
                headerRowNumber,
                startingCell,
                endingCell,
              )) as string[];

            // 1. update availableHeaderOptions
            setAvailableHeaderOptions(filteredAvailableHeaderOptions);

            // 2. update selectedHeaders in the form
            // FIXME:
            const previousSelectedHeaders =
              methods.getValues("selectedHeaders");
            const newSelectedHeaders = filteredAvailableHeaderOptions.filter(
              (header) => previousSelectedHeaders.includes(header),
            );
            methods.setValue(
              "selectedHeaders",
              removeAllDuplicates([...newSelectedHeaders]),
              {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              },
            );
          } else {
            // otherwise, the cellRange is off, so no need to filter the fullHeaderOptions -> handle it just like csv file

            setIsReadingHeader(true);
            const newFullHeaderOptions = await readHeaderValuesAsync(
              fileToUpload,
              headerRowNumber,
            );
            setIsReadingHeader(false);

            // 1. update availableHeaderOptions
            setAvailableHeaderOptions(newFullHeaderOptions);

            // 2. update selectedHeaders in the form
            // user first time config the fileToUpload, the selectedHeaders should be the same as the fullHeaderOptions on headerRowNumber change
            methods.setValue(
              "selectedHeaders",
              removeAllDuplicates(newFullHeaderOptions),
              {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              },
            );
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headerRowNumber, isCellRangeCheckboxOn, startingCell, endingCell],
  );

  /**
   * update availableHeaderOptions and also selectedHeaders field in the form. Three factor can update availableHeaderOptions
   * 1. rowHeaderNumber change -> re-read file headers asynchronously
   * 2. cellRange change -> apply column bound filtering on the headers read from file
   * 3. isCellRangeCheckboxOn change -> directly changes availableHeaderOptions, and selectedHeaders
   *
   * have to enumerate all edge cases in the logic
   */
  useEffect(() => {
    updateOnHeaderRowNumberChangeForCSVFile();
  }, [updateOnHeaderRowNumberChangeForCSVFile]);

  useEffect(() => {
    updateOnDependencyChangeForExcelFile();
  }, [updateOnDependencyChangeForExcelFile]);

  return { isReadingHeader };
};
