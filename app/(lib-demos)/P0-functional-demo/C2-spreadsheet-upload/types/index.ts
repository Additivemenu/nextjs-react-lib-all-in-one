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
export interface SpreadsheetState {
  data: any[];
  columnDefs: ColDef[]; // as the column def is dynamic, we keep it a state here
  selectedData: any[];
  selectedRange: string;
  selectedCellRefs: CellReference[];
}

// Action types for reducer
export type SpreadsheetAction =
  | { type: "SET_DATA"; payload: { data: any[]; columnDefs: ColDef[] } }
  | {
      type: "SET_SELECTION";
      payload: { data: any[]; range: string; cellRefs: CellReference[] };
    }
  | { type: "CLEAR_DATA" };
