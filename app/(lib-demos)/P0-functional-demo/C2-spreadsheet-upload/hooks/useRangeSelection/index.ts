import { UseFormSetValue } from "react-hook-form";
import { parseRange, scrollToCell } from "../../utils/excel-helpers";
import {
  SpreadsheetState,
  SpreadsheetAction,
  UploadFormData,
} from "../../types/index";

export const useRangeSelection = (
  state: SpreadsheetState,
  dispatch: React.Dispatch<SpreadsheetAction>,
  setValue: UseFormSetValue<UploadFormData>,
) => {
  const handleUpdateSelection = (cellRangeValue: string) => {
    if (!cellRangeValue?.trim()) {
      // Clear selection if empty range
      dispatch({
        type: "SET_SELECTED_RANGE",
        payload: { range: "" },
      });
      return;
    }

    // Validate range before setting
    const cellRefs = parseRange(cellRangeValue);
    if (!cellRefs) return; // Invalid range, don't update state

    // Update source state - derived state will be computed automatically
    dispatch({
      type: "SET_SELECTED_RANGE",
      payload: { range: cellRangeValue },
    });

    // Scroll to the first cell in the range
    if (cellRefs.length > 0 && cellRefs[0].row >= 0 && cellRefs[0].col >= 0) {
      scrollToCell(cellRefs[0].col, cellRefs[0].row);
    }
  };

  const handleClearSelection = () => {
    dispatch({
      type: "SET_SELECTED_RANGE",
      payload: { range: "" },
    });
    setValue("cellRange", "");
  };

  return { handleUpdateSelection, handleClearSelection };
};
