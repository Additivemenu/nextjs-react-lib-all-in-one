import { toast } from "sonner";
// import { readFileAsArrayBuffer } from "../utils/file-reader";
import { SpreadsheetAction } from "../types/index";

import { ChangeEvent, Dispatch } from "react";
// import { SpreadsheetAction } from "../reducers/spreadsheet-reducer";

export const useFileUpload = (
  dispatch: Dispatch<SpreadsheetAction>,
  headerRowIndex: number = 0,
) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Clear any previous data
      dispatch({ type: "SET_DATA", payload: { data: [], columnDefs: [] } });

      // Import file processing utility
      const { processFileWithHeader } = await import("../utils/file-processor");
      const result = await processFileWithHeader(file, headerRowIndex);

      dispatch({ type: "SET_DATA", payload: result });
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleHeaderRowChange = async (
    newHeaderRowIndex: number,
    currentFile?: File,
  ) => {
    if (!currentFile) return;

    try {
      // Clear previous data
      dispatch({ type: "SET_DATA", payload: { data: [], columnDefs: [] } });

      const { processFileWithHeader } = await import("../utils/file-processor");
      const result = await processFileWithHeader(
        currentFile,
        newHeaderRowIndex,
      );

      dispatch({ type: "SET_DATA", payload: result });
    } catch (error) {
      console.error("Error reprocessing file with new header row:", error);
    }
  };

  return {
    handleFileChange,
    handleHeaderRowChange,
  };
};
