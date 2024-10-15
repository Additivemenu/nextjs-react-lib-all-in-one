import { z } from "zod";

/**
 * refine() is a method that allows you to add a single issue to the schema based on the data.
 */
const schemaWithRefine = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    age: z.number().min(0, "Age must be a positive number"),
  })
  .refine((data) => data.age >= 18, {
    message: "You must be at least 18 years old",
    path: ["age"],
  });

/**
 * superRefine() is a more powerful version of refine() that allows you to add multiple issues at once, allowing more complex validation logic.
 */
const schemaWithSuperRefine = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    age: z.number().min(0, "Age must be a positive number"),
  })
  .superRefine((data, ctx) => {
    if (data.age < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must be at least 18 years old",
        path: ["age"],
      });
    }
    if (data.age > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age seems unrealistic",
        path: ["age"],
      });
    }
  });

export type FormData = z.infer<typeof schemaWithRefine>;

export { schemaWithRefine, schemaWithSuperRefine };
