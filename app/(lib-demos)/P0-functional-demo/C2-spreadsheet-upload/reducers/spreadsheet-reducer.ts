import { SpreadsheetState, SpreadsheetAction } from "../types";

// Initial state for the spreadsheet application (Source Data Only)
export const initialSpreadsheetState: SpreadsheetState = {
  // Raw data from uploaded file (array of row objects)
  data: [],

  // AG Grid column definitions for rendering the spreadsheet
  columnDefs: [],

  // String representation of selected range (e.g. "A1:C10", "B2:D5") - SOURCE
  selectedRange: "",

  // Note: selectedData and selectedCellRefs are now computed on-demand
  // rather than stored in state to prevent redundancy and state inconsistency
};

// Reducer (Simplified - only manages source data)
export function spreadsheetReducer(
  state: SpreadsheetState,
  action: SpreadsheetAction,
): SpreadsheetState {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data,
        columnDefs: action.payload.columnDefs,
        selectedRange: "", // Clear selection when new data is loaded
      };
    case "SET_SELECTED_RANGE":
      return {
        ...state,
        selectedRange: action.payload.range,
      };
    case "CLEAR_DATA":
      return initialSpreadsheetState;
    default:
      return state;
  }
}
