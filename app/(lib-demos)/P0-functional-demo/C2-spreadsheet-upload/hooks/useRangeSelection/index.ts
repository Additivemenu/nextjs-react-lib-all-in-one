import { UseFormSetValue } from "react-hook-form";
import {
  parseRange,
  getCellRange,
  scrollToCell,
} from "../../utils/excel-helpers";
import {
  SpreadsheetState,
  SpreadsheetAction,
  UploadFormData,
} from "../../types";

export const useRangeSelection = (
  state: SpreadsheetState,
  dispatch: React.Dispatch<SpreadsheetAction>,
  setValue: UseFormSetValue<UploadFormData>,
) => {
  const handleUpdateSelection = (cellRangeValue: string) => {
    if (!cellRangeValue?.trim()) return;

    const cellRefs = parseRange(cellRangeValue);
    if (!cellRefs) return;

    const result = getCellRange(state.data, state.columnDefs, cellRefs);
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: result.data,
        range: result.range,
        cellRefs: cellRefs,
      },
    });

    // Scroll to the first cell in the range
    if (cellRefs.length > 0 && cellRefs[0].row >= 0 && cellRefs[0].col >= 0) {
      scrollToCell(cellRefs[0].col, cellRefs[0].row);
    }
  };

  const handleClearSelection = () => {
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: [],
        range: "",
        cellRefs: [],
      },
    });
    setValue("cellRange", "");
  };

  return { handleUpdateSelection, handleClearSelection };
};
