import { ColDef } from "ag-grid-community";

// Form data types
export interface UploadFormData {
  file: any;
  cellRange: string; // e.g., "A1:C10"
}

// Cell reference type
export interface CellReference {
  row: number;
  col: number;
}

// Spreadsheet state types
// critical to figure out data structure for state management (even for OOP as well)
export interface SpreadsheetState {
  data: any[];
  columnDefs: ColDef[]; // as the column def is dynamic, we keep it a state here
  selectedData: any[];
  selectedRange: string;
  selectedCellRefs: CellReference[];
}

// Action types for reducer
// discriminated union type for actions
export type SpreadsheetAction =
  | { type: "SET_DATA"; payload: { data: any[]; columnDefs: ColDef[] } }
  | {
      type: "SET_SELECTION";
      payload: { data: any[]; range: string; cellRefs: CellReference[] };
    }
  | { type: "CLEAR_DATA" };
