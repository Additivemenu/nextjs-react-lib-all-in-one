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

// Parse range string like "A1:C3" or "A1" into cell references
export const parseRange = (range: string): CellReference[] | null => {
  const cellPattern = /^([A-Z]+)(\d+)$/;
  const rangePattern = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/;
  const columnPattern = /^([A-Z]+):([A-Z]+)$/;
  const rowPattern = /^(\d+):(\d+)$/;

  // Single cell (e.g., A1)
  const cellMatch = range.match(cellPattern);
  if (cellMatch) {
    const [, col, row] = cellMatch;
    return [{ col: columnToNumber(col), row: parseInt(row) - 1 }];
  }

  // Range (e.g., A1:C3)
  const rangeMatch = range.match(rangePattern);
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
  const columnMatch = range.match(columnPattern);
  if (columnMatch) {
    const [, startCol, endCol] = columnMatch;
    return [
      { col: columnToNumber(startCol), row: -1 },
      { col: columnToNumber(endCol), row: -1 },
    ];
  }

  // Row range (e.g., 1:3)
  const rowMatch = range.match(rowPattern);
  if (rowMatch) {
    const [, startRow, endRow] = rowMatch;
    return [
      { col: -1, row: parseInt(startRow) - 1 },
      { col: -1, row: parseInt(endRow) - 1 },
    ];
  }

  return null;
};

// Get cell range data from the grid
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
