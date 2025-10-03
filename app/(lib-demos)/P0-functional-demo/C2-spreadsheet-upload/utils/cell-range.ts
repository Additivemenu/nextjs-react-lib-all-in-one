import { CellReference } from "../types/index";

/**
 * Represents different types of cell ranges
 */
export type RangeType = "single" | "cellRange" | "columnRange" | "rowRange";

/**
 * Interface for parsed range information
 */
export interface ParsedRange {
  type: RangeType;
  start: CellReference;
  end?: CellReference;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * CellRange class for parsing, validating, and manipulating Excel-style cell ranges
 *
 * Examples:
 * - Single cell: "A1"
 * - Cell range: "A1:C10"
 * - Column range: "A:C"
 * - Row range: "1:3"
 */
export class CellRange {
  private _original: string;
  private _parsed: ParsedRange | null = null;

  // Static regex patterns
  private static readonly SINGLE_CELL_PATTERN = /^([A-Z]+)(\d+)$/i;
  private static readonly CELL_RANGE_PATTERN = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i;
  private static readonly COLUMN_RANGE_PATTERN = /^([A-Z]+):([A-Z]+)$/i;
  private static readonly ROW_RANGE_PATTERN = /^(\d+):(\d+)$/i;

  constructor(range: string) {
    this._original = range.trim();
    this._parsed = this.parseRange();
  }

  /**
   * Convert Excel column letter to number (1-based)
   */
  private static columnToNumber(col: string): number {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
      result =
        result * 26 + (col.toUpperCase().charCodeAt(i) - "A".charCodeAt(0) + 1);
    }
    return result;
  }

  /**
   * Convert number to Excel column letter (1-based)
   */
  private static numberToColumn(num: number): string {
    let result = "";
    while (num > 0) {
      num--; // Convert to 0-based
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  }

  /**
   * Parse a cell reference string (e.g., "A1") into CellReference
   */
  private parseCellReference(cellStr: string): CellReference | null {
    const match = cellStr.match(CellRange.SINGLE_CELL_PATTERN);
    if (!match) return null;

    const [, col, row] = match;
    return {
      col: CellRange.columnToNumber(col) - 1, // Convert to 0-based
      row: parseInt(row) - 1, // Convert to 0-based
    };
  }

  /**
   * Parse the range string and return parsed information
   */
  private parseRange(): ParsedRange {
    if (!this._original) {
      return {
        type: "single",
        start: { col: -1, row: -1 },
        isValid: false,
        errorMessage: "Empty range",
      };
    }

    // Single cell (e.g., "A1")
    if (CellRange.SINGLE_CELL_PATTERN.test(this._original)) {
      const cellRef = this.parseCellReference(this._original);
      if (!cellRef) {
        return {
          type: "single",
          start: { col: -1, row: -1 },
          isValid: false,
          errorMessage: "Invalid cell reference",
        };
      }
      return {
        type: "single",
        start: cellRef,
        isValid: true,
      };
    }

    // Cell range (e.g., "A1:C10")
    const cellRangeMatch = this._original.match(CellRange.CELL_RANGE_PATTERN);
    if (cellRangeMatch) {
      const [, startCol, startRow, endCol, endRow] = cellRangeMatch;

      const startRef = this.parseCellReference(`${startCol}${startRow}`);
      const endRef = this.parseCellReference(`${endCol}${endRow}`);

      if (!startRef || !endRef) {
        return {
          type: "cellRange",
          start: { col: -1, row: -1 },
          isValid: false,
          errorMessage: "Invalid cell references in range",
        };
      }

      // Validate that start is top-left of end
      if (startRef.col > endRef.col || startRef.row > endRef.row) {
        return {
          type: "cellRange",
          start: startRef,
          end: endRef,
          isValid: false,
          errorMessage: "Start cell must be top-left of end cell",
        };
      }

      return {
        type: "cellRange",
        start: startRef,
        end: endRef,
        isValid: true,
      };
    }

    // Column range (e.g., "A:C")
    const columnRangeMatch = this._original.match(
      CellRange.COLUMN_RANGE_PATTERN,
    );
    if (columnRangeMatch) {
      const [, startCol, endCol] = columnRangeMatch;
      const startColNum = CellRange.columnToNumber(startCol) - 1; // 0-based
      const endColNum = CellRange.columnToNumber(endCol) - 1; // 0-based

      if (startColNum > endColNum) {
        return {
          type: "columnRange",
          start: { col: startColNum, row: -1 },
          end: { col: endColNum, row: -1 },
          isValid: false,
          errorMessage: "Start column must come before end column",
        };
      }

      return {
        type: "columnRange",
        start: { col: startColNum, row: -1 },
        end: { col: endColNum, row: -1 },
        isValid: true,
      };
    }

    // Row range (e.g., "1:3")
    const rowRangeMatch = this._original.match(CellRange.ROW_RANGE_PATTERN);
    if (rowRangeMatch) {
      const [, startRow, endRow] = rowRangeMatch;
      const startRowNum = parseInt(startRow) - 1; // 0-based
      const endRowNum = parseInt(endRow) - 1; // 0-based

      if (startRowNum > endRowNum) {
        return {
          type: "rowRange",
          start: { col: -1, row: startRowNum },
          end: { col: -1, row: endRowNum },
          isValid: false,
          errorMessage: "Start row must come before end row",
        };
      }

      return {
        type: "rowRange",
        start: { col: -1, row: startRowNum },
        end: { col: -1, row: endRowNum },
        isValid: true,
      };
    }

    return {
      type: "single",
      start: { col: -1, row: -1 },
      isValid: false,
      errorMessage:
        "Invalid range format. Use formats like A1, A1:C10, A:C, or 1:3",
    };
  }

  /**
   * Check if the range is valid
   */
  isValid(): boolean {
    return this._parsed?.isValid ?? false;
  }

  /**
   * Get validation error message if invalid
   */
  getErrorMessage(): string | undefined {
    return this._parsed?.errorMessage;
  }

  /**
   * Get the range type
   */
  getType(): RangeType | null {
    return this._parsed?.type ?? null;
  }

  /**
   * Get parsed range information
   */
  getParsedRange(): ParsedRange | null {
    return this._parsed;
  }

  /**
   * Transform range to account for row index column offset
   * e.g., "A1:C10" becomes "B1:D10" to skip the row index column
   */
  transformWithOffset(): CellRange {
    if (!this._parsed?.isValid) return this;

    let transformedRange = this._original;

    switch (this._parsed.type) {
      case "single": {
        const match = this._original.match(CellRange.SINGLE_CELL_PATTERN);
        if (match) {
          const [, col, row] = match;
          const newCol = CellRange.numberToColumn(
            CellRange.columnToNumber(col) + 1,
          );
          transformedRange = `${newCol}${row}`;
        }
        break;
      }
      case "cellRange": {
        const match = this._original.match(CellRange.CELL_RANGE_PATTERN);
        if (match) {
          const [, startCol, startRow, endCol, endRow] = match;
          const newStartCol = CellRange.numberToColumn(
            CellRange.columnToNumber(startCol) + 1,
          );
          const newEndCol = CellRange.numberToColumn(
            CellRange.columnToNumber(endCol) + 1,
          );
          transformedRange = `${newStartCol}${startRow}:${newEndCol}${endRow}`;
        }
        break;
      }
      case "columnRange": {
        const match = this._original.match(CellRange.COLUMN_RANGE_PATTERN);
        if (match) {
          const [, startCol, endCol] = match;
          const newStartCol = CellRange.numberToColumn(
            CellRange.columnToNumber(startCol) + 1,
          );
          const newEndCol = CellRange.numberToColumn(
            CellRange.columnToNumber(endCol) + 1,
          );
          transformedRange = `${newStartCol}:${newEndCol}`;
        }
        break;
      }
      case "rowRange":
        // Row ranges don't need transformation
        break;
    }

    return new CellRange(transformedRange);
  }

  /**
   * Convert range to array of cell references
   */
  toCellReferences(): CellReference[] {
    if (!this._parsed?.isValid) return [];

    switch (this._parsed.type) {
      case "single":
        return [this._parsed.start];

      case "cellRange": {
        const { start, end } = this._parsed;
        if (!end) return [];

        const references: CellReference[] = [];
        for (let row = start.row; row <= end.row; row++) {
          for (let col = start.col; col <= end.col; col++) {
            references.push({ col, row });
          }
        }
        return references;
      }

      case "columnRange": {
        const { start, end } = this._parsed;
        if (!end) return [];
        return [start, end];
      }

      case "rowRange": {
        const { start, end } = this._parsed;
        if (!end) return [];
        return [start, end];
      }

      default:
        return [];
    }
  }

  /**
   * Get the original range string
   */
  toString(): string {
    return this._original;
  }

  /**
   * Static method to validate a range string
   */
  static validate(range: string): { isValid: boolean; errorMessage?: string } {
    if (!range || range.trim() === "") {
      return { isValid: true }; // Allow empty ranges
    }

    const cellRange = new CellRange(range);
    return {
      isValid: cellRange.isValid(),
      errorMessage: cellRange.getErrorMessage(),
    };
  }

  /**
   * Static method to create a CellRange with offset transformation
   */
  static createWithOffset(range: string): CellRange {
    const original = new CellRange(range);
    return original.transformWithOffset();
  }
}
