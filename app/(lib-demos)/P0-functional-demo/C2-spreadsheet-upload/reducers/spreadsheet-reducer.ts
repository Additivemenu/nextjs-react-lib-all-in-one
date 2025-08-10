import { SpreadsheetState, SpreadsheetAction } from "../types";

// Initial state for the spreadsheet application
export const initialSpreadsheetState: SpreadsheetState = {
  // Raw data from uploaded file (array of row objects)
  data: [],

  // AG Grid column definitions for rendering the spreadsheet
  columnDefs: [],

  // Filtered data based on selected range (subset of 'data')
  selectedData: [],

  // String representation of selected range (e.g. "A1:C10", "B2:D5")
  selectedRange: "",

  // Array of individual cell references for highlighting (e.g. [{row: 0, col: 0}, {row: 0, col: 1}])
  selectedCellRefs: [],
};

// Reducer
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
        selectedData: [],
        selectedRange: "",
        selectedCellRefs: [],
      };
    case "SET_SELECTION":
      return {
        ...state,
        selectedData: action.payload.data,
        selectedRange: action.payload.range,
        selectedCellRefs: action.payload.cellRefs,
      };
    case "CLEAR_DATA":
      return initialSpreadsheetState;
    default:
      return state;
  }
}
