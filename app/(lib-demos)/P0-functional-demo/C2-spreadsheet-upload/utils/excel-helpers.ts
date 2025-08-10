import { CellReference } from "../types";
import { ColDef } from "ag-grid-community";

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
  const cellPattern = /^([A-Z]+)(\d+)$/;
  const rangePattern = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/;
  const columnPattern = /^([A-Z]+):([A-Z]+)$/;
  const rowPattern = /^(\d+):(\d+)$/;

  // Transform range to offset column indices to account for row index column
  // e.g. "A1:C10" will be converted to "B1:D10" if the leftmost column is "A"
  const transformRange = (inputRange: string): string => {
    // Single cell pattern (e.g., A1 -> B1)
    const singleCellMatch = inputRange.match(/^([A-Z]+)(\d+)$/);
    if (singleCellMatch) {
      const [, col, row] = singleCellMatch;
      const newCol = String.fromCharCode(col.charCodeAt(0) + 1); // A->B, B->C, etc.
      return `${newCol}${row}`;
    }

    // Range pattern (e.g., A1:C10 -> B1:D10)
    const rangeMatch = inputRange.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (rangeMatch) {
      const [, startCol, startRow, endCol, endRow] = rangeMatch;
      const newStartCol = String.fromCharCode(startCol.charCodeAt(0) + 1);
      const newEndCol = String.fromCharCode(endCol.charCodeAt(0) + 1);
      return `${newStartCol}${startRow}:${newEndCol}${endRow}`;
    }

    // Column range pattern (e.g., A:C -> B:D)
    const colRangeMatch = inputRange.match(/^([A-Z]+):([A-Z]+)$/);
    if (colRangeMatch) {
      const [, startCol, endCol] = colRangeMatch;
      const newStartCol = String.fromCharCode(startCol.charCodeAt(0) + 1);
      const newEndCol = String.fromCharCode(endCol.charCodeAt(0) + 1);
      return `${newStartCol}:${newEndCol}`;
    }

    // Row ranges don't need transformation
    return inputRange;
  };

  // Transform the input range to account for row index column
  const transformedRange = transformRange(range);

  // Single cell (e.g., A1)
  const cellMatch = transformedRange.match(cellPattern);
  if (cellMatch) {
    const [, col, row] = cellMatch;
    return [{ col: columnToNumber(col), row: parseInt(row) - 1 }];
  }

  // Range (e.g., A1:C3)
  const rangeMatch = transformedRange.match(rangePattern);
  if (rangeMatch) {
    const [, startCol, startRow, endCol, endRow] = rangeMatch;
    const startColNum = columnToNumber(startCol);
    const endColNum = columnToNumber(endCol);
    const startRowNum = parseInt(startRow) - 1;
    const endRowNum = parseInt(endRow) - 1;

    const references: CellReference[] = [];
    for (let row = startRowNum; row <= endRowNum; row++) {
      for (let col = startColNum; col <= endColNum; col++) {
        references.push({ col: col, row });
      }
    }
    return references;
  }

  // Column range (e.g., A:C)
  const columnMatch = transformedRange.match(columnPattern);
  if (columnMatch) {
    const [, startCol, endCol] = columnMatch;
    return [
      { col: columnToNumber(startCol), row: -1 },
      { col: columnToNumber(endCol), row: -1 },
    ];
  }

  // Row range (e.g., 1:3)
  const rowMatch = transformedRange.match(rowPattern);
  if (rowMatch) {
    const [, startRow, endRow] = rowMatch;
    return [
      { col: -1, row: parseInt(startRow) - 1 },
      { col: -1, row: parseInt(endRow) - 1 },
    ];
  }

  return null;
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
