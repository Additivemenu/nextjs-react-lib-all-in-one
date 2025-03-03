import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["work", "personal", "shopping", "health"]),
  dueDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return parsedDate > new Date();
  }, "Due date must be in the future"),
});

// Infer the TypeScript type from the Zod schema
export type TaskFormData = z.infer<typeof taskSchema>;

export const INITIAL_FORM_VALUE: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  category: "work",
  dueDate: new Date().toISOString().split("T")[0], // Set to today's date in YYYY-MM-DD format
};
