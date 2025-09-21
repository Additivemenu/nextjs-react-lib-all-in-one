import { z } from "zod";
import { CellRange } from "../utils/cell-range";

// Zod schema for form validation
export const uploadFormSchema = z.object({
  file: z
    .any()
    .optional()
    .refine((files) => !files || files?.[0], "File is required when provided")
    .refine((files) => {
      if (!files || !files[0]) return true; // Allow empty for optional
      const file = files[0];
      return [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type);
    }, "Only CSV and Excel files are supported"),
  cellRange: z.string().optional(),
  headerRowIndex: z
    .number()
    .min(0, "Header row index must be 0 or greater")
    .default(0),
});
