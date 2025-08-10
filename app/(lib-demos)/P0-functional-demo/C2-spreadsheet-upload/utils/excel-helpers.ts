import { CellReference } from "../types";
import { ColDef } from "ag-grid-community";
import { CellRange } from "./cell-range";

// Helper function to convert column index to Excel column letter
export const getColumnLetter = (index: number): string => {
  let result = "";
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

// Helper function to convert Excel column letter to index
export const getColumnIndex = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
};

// Helper function to convert column letter to number (0-based)
export const columnToNumber = (col: string): number => {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return result - 1; // Convert to 0-based index
};

// Helper function to parse cell reference like "A1"
export const parseCellReference = (cellRef: string): CellReference | null => {
  const match = cellRef.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;

  const col = getColumnIndex(match[1]);
  const row = parseInt(match[2]) - 1; // Convert to 0-based index

  return { row, col };
};

/**
 * Parse a range string like "A1:C3" or "A1" into cell references
 * @param range The range string to parse e.g. "A1:C10", "B2:D5"
 * @returns An array of cell references or null if invalid
 *
 * Examples:
 *
 * Single cell:
 * parseRange("A1") → [{ col: 1, row: 0 }] (transformed from A1 to B1, then parsed)
 * parseRange("B5") → [{ col: 2, row: 4 }] (transformed from B5 to C5, then parsed)
 *
 * Cell range:
 * parseRange("A1:C3") → [
 *   { col: 1, row: 0 }, { col: 2, row: 0 }, { col: 3, row: 0 },  // Row 1 (B1:D1)
 *   { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },  // Row 2 (B2:D2)
 *   { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }   // Row 3 (B3:D3)
 * ]
 *
 * Column range:
 * parseRange("A:C") → [{ col: 1, row: -1 }, { col: 3, row: -1 }] (B:D after transform)
 * parseRange("B:D") → [{ col: 2, row: -1 }, { col: 4, row: -1 }] (C:E after transform)
 *
 * Row range:
 * parseRange("1:3") → [{ col: -1, row: 0 }, { col: -1, row: 2 }] (no transformation needed)
 * parseRange("5:7") → [{ col: -1, row: 4 }, { col: -1, row: 6 }] (no transformation needed)
 *
 * Invalid input:
 * parseRange("XYZ") → null
 * parseRange("A1:") → null
 * parseRange("") → null
 *
 * !Note: All column indices are shifted by +1 to account for the row index column (#)
 * at position 0 in the grid. This means user input "A1" actually selects grid column 1.
 */
export const parseRange = (range: string): CellReference[] | null => {
  // Use the new CellRange class for parsing and validation
  const cellRange = CellRange.createWithOffset(range);

  if (!cellRange.isValid()) {
    return null;
  }

  return cellRange.toCellReferences();
};

/**
 * Get the cell range from the grid data
 * @param data The grid data
 * @param columnDefs The column definitions
 * @param cellRefs The cell references
 * @returns The selected cell range
 */
export const getCellRange = (
  data: any[],
  columnDefs: ColDef[],
  cellRefs: CellReference[],
): { data: any[]; range: string } => {
  if (!cellRefs || cellRefs.length === 0) {
    return { data: [], range: "" };
  }

  // Handle column ranges
  if (cellRefs.length === 2 && cellRefs[0].row === -1) {
    const startCol = cellRefs[0].col;
    const endCol = cellRefs[1].col;
    const selectedData = data.map((row) => {
      const newRow: any = {};
      for (let col = startCol; col <= endCol; col++) {
        if (columnDefs[col]) {
          const fieldName = columnDefs[col].field || `col_${col}`;
          newRow[fieldName] = row[fieldName];
        }
      }
      return newRow;
    });
    return {
      data: selectedData,
      range: `Columns ${startCol + 1}-${endCol + 1}`,
    };
  }

  // Handle row ranges
  if (cellRefs.length === 2 && cellRefs[0].col === -1) {
    const startRow = cellRefs[0].row;
    const endRow = cellRefs[1].row;
    const selectedData = data.slice(startRow, endRow + 1);
    return {
      data: selectedData,
      range: `Rows ${startRow + 1}-${endRow + 1}`,
    };
  }

  // Handle cell ranges and single cells
  const minRow = Math.min(...cellRefs.map((ref) => ref.row));
  const maxRow = Math.max(...cellRefs.map((ref) => ref.row));
  const minCol = Math.min(...cellRefs.map((ref) => ref.col));
  const maxCol = Math.max(...cellRefs.map((ref) => ref.col));

  const selectedData = data.slice(minRow, maxRow + 1).map((row) => {
    const newRow: any = {};
    for (let col = minCol; col <= maxCol; col++) {
      if (columnDefs[col]) {
        const fieldName = columnDefs[col].field || `col_${col}`;
        newRow[fieldName] = row[fieldName];
      }
    }
    return newRow;
  });

  const range =
    cellRefs.length === 1
      ? `Cell (${minRow + 1}, ${minCol + 1})`
      : `Range (${minRow + 1}, ${minCol + 1}) to (${maxRow + 1}, ${
          maxCol + 1
        })`;

  return { data: selectedData, range };
};

// Scroll to a specific cell in the grid
export const scrollToCell = (columnIndex: number, rowIndex: number) => {
  const gridApi = document.querySelector(".ag-theme-alpine") as any;
  if (gridApi && gridApi.api) {
    gridApi.api.ensureIndexVisible(rowIndex);
    gridApi.api.ensureColumnVisible(columnIndex);
  }
};

// Helper function to clear file input manually
export const clearFileInput = (): void => {
  const fileInput = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
};
