import { CellRangeOption } from "../types";

const regex = /^([A-Z]+)(\d+)$/;

export function validateCell(cell: string): boolean {
  const match = cell.match(regex);
  return !!match;
}

export function extractColumnAndRowFromCell(cell: string): {
  column: string;
  row: number;
} {
  const match = cell.match(regex);

  if (!match) {
    throw new Error("Invalid cell range");
  }

  const column = match[1];
  const row = parseInt(match[2], 10);
  return {
    column,
    row,
  };
}

export function validateCellRange(
  cellRange: CellRangeOption,
): boolean {
  if (
    !validateCell(cellRange.startingCell) ||
    !validateCell(cellRange.endingCell)
  ) {
    return false;
  }

  const { column: startingCellColumn, row: startingCellRow } =
    extractColumnAndRowFromCell(cellRange.startingCell);
  const { column: endingCellColumn, row: endingCellRow } =
    extractColumnAndRowFromCell(cellRange.endingCell);

  return (
    startingCellColumn <= endingCellColumn &&
    startingCellRow <= endingCellRow
  );
}

export function excelColumnStrToColumnIndex(column: string): number {
  if (!/^[A-Z]+$/.test(column)) {
    throw new Error(
      "Invalid input: column string must only contain uppercase A-Z characters."
    );
  }

  let columnNumber = 0;

  for (let i = 0; i < column.length; i++) {
    const charCode = column.charCodeAt(i) - 65 + 1; // Convert 'A' -> 1, 'B' -> 2, ... 'Z' -> 25, 'AA' -> 26 etc.
    columnNumber = columnNumber * 26 + charCode;
  }

  return columnNumber - 1; // Convert to zero-based index
}

export function getColumnIndexBound(cellRange: CellRangeOption): {
  leftBoundIndex: number;
  rightBoundIndex: number;
} {
  if (!validateCellRange(cellRange)) {
    throw new Error("Invalid cell range");
  }

  const { startingCell, endingCell } = cellRange;
  const startingCellColumnStr =
    extractColumnAndRowFromCell(startingCell).column;
  const endingCellColumnStr = extractColumnAndRowFromCell(endingCell).column;

  return {
    leftBoundIndex: excelColumnStrToColumnIndex(startingCellColumnStr),
    rightBoundIndex: excelColumnStrToColumnIndex(endingCellColumnStr),
  };
}

export function getStartingCellRowNumber(cellRange: CellRangeOption): number {
  if (!validateCellRange(cellRange)) {
    throw new Error("Invalid cell range");
  }

  return extractColumnAndRowFromCell(cellRange.startingCell).row;
}
