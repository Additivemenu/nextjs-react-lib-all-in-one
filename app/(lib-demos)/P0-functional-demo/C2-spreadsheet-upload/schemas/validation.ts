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
      // Basic validation for cell range format (A1, A1:C10, A:C, etc.)
      const rangePattern = /^[A-Z]+\d*(?::[A-Z]+\d*)?$/i;
      return rangePattern.test(range.trim());
    }, "Invalid range format. Use formats like A1, A1:C10, or A:C"),
});
