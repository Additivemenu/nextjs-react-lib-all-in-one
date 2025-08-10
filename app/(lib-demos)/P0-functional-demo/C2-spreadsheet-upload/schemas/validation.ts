import { z } from "zod";

// Zod schema for form validation
export const uploadFormSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length > 0, "Please select a file")
    .refine((files) => {
      const file = files?.[0];
      return (
        file &&
        (file.type === "text/csv" ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      );
    }, "Only CSV and Excel files are allowed"),
  cellRange: z
    .string()
    .optional()
    .refine((range) => {
      if (!range || range.trim() === "") return true; // Allow empty range

      const trimmedRange = range.trim();

      // Basic format validation for cell range (A1, A1:C10, A:C, 1:3, etc.)
      const singleCellPattern = /^[A-Z]+\d+$/i;
      const cellRangePattern = /^[A-Z]+\d+:[A-Z]+\d+$/i;
      const columnRangePattern = /^[A-Z]+:[A-Z]+$/i;
      const rowRangePattern = /^\d+:\d+$/i;

      // Check if it matches any valid pattern
      if (
        !singleCellPattern.test(trimmedRange) &&
        !cellRangePattern.test(trimmedRange) &&
        !columnRangePattern.test(trimmedRange) &&
        !rowRangePattern.test(trimmedRange)
      ) {
        return false;
      }

      // For single cells, column ranges, and row ranges, no further validation needed
      if (
        singleCellPattern.test(trimmedRange) ||
        columnRangePattern.test(trimmedRange) ||
        rowRangePattern.test(trimmedRange)
      ) {
        return true;
      }

      // For cell ranges (A1:C10), validate that top-left is actually top-left of bottom-right
      if (cellRangePattern.test(trimmedRange)) {
        const [startCell, endCell] = trimmedRange.split(":");

        // Parse start cell (e.g., "A1")
        const startMatch = startCell.match(/^([A-Z]+)(\d+)$/i);
        if (!startMatch) return false;
        const [, startCol, startRow] = startMatch;

        // Parse end cell (e.g., "C10")
        const endMatch = endCell.match(/^([A-Z]+)(\d+)$/i);
        if (!endMatch) return false;
        const [, endCol, endRow] = endMatch;

        // Convert column letters to numbers for comparison
        const columnToNumber = (col: string): number => {
          let result = 0;
          for (let i = 0; i < col.length; i++) {
            result =
              result * 26 +
              (col.toUpperCase().charCodeAt(i) - "A".charCodeAt(0) + 1);
          }
          return result;
        };

        const startColNum = columnToNumber(startCol);
        const endColNum = columnToNumber(endCol);
        const startRowNum = parseInt(startRow);
        const endRowNum = parseInt(endRow);

        // Validate that start is top-left of end
        return startColNum <= endColNum && startRowNum <= endRowNum;
      }

      return true;
    }, "Invalid range format. Use formats like A1, A1:C10, A:C, or 1:3. For ranges, ensure top-left cell comes before bottom-right cell."),
});
