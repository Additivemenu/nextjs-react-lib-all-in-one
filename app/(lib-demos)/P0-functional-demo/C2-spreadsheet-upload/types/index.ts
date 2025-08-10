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

//! Spreadsheet state types
// critical to figure out data structure for state management (even for OOP as well)
export interface SpreadsheetState {
  // 📊 Source Data Only (Single Source of Truth)
  data: any[]; // Raw rows from uploaded file
  columnDefs: ColDef[]; // Dynamic column definitions for AG Grid
  selectedRange: string; // Human-readable range (e.g., "A1:C10") - SOURCE

  // Note: selectedCellRefs and selectedData are now DERIVED from the above sources
  // and computed on-demand rather than stored in state
}

// 🔄 Derived State Interface (Computed Properties)
export interface DerivedSpreadsheetState {
  selectedCellRefs: CellReference[]; // Derived from selectedRange
  selectedData: any[]; // Derived from data + selectedRange
  selectedRangeDescription: string; // Derived description for UI
}

// Action types for reducer
// discriminated union type for actions
export type SpreadsheetAction =
  | { type: "SET_DATA"; payload: { data: any[]; columnDefs: ColDef[] } }
  | { type: "SET_SELECTED_RANGE"; payload: { range: string } }
  | { type: "CLEAR_DATA" };
