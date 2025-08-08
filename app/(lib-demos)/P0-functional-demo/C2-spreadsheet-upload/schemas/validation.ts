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
  startCell: z.string().optional(),
  endCell: z.string().optional(),
});
