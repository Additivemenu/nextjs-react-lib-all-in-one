import { z } from "zod";
import { CellRange } from "../utils/cell-range";

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
    .refine(
      (range) => {
        if (!range || range.trim() === "") return true; // Allow empty range

        const validation = CellRange.validate(range);
        return validation.isValid;
      },
      (range) => {
        if (!range || range.trim() === "")
          return { message: "Range is required" };

        const validation = CellRange.validate(range);
        return {
          message:
            validation.errorMessage ||
            "Invalid range format. Use formats like A1, A1:C10, A:C, or 1:3. For ranges, ensure top-left cell comes before bottom-right cell.",
        };
      },
    ),
});
