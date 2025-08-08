import { ColDef } from "ag-grid-community";

// Form data types
export interface UploadFormData {
  file: any;
}

// Cell reference type
export interface CellReference {
  row: number;
  col: number;
}

// Spreadsheet state types
export interface SpreadsheetState {
  data: any[];
  columnDefs: ColDef[];
  selectedData: any[];
  selectedRange: string;
}

// Action types for reducer
export type SpreadsheetAction =
  | { type: "SET_DATA"; payload: { data: any[]; columnDefs: ColDef[] } }
  | { type: "SET_SELECTION"; payload: { data: any[]; range: string } }
  | { type: "CLEAR_DATA" };
