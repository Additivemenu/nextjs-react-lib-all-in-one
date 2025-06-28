export {};
// import { z } from "zod";

// import { toast } from "@/lib/toast-manager";

// export const schema = z.object({
//   sort_columns: z
//     .array(
//       z.object({
//         name: z.string().min(1, "Column name is required"),
//         order: z.enum(["ascending", "descending"]),
//       }),
//     )
//     .min(1, "At least one column is required"),
// });

// export type SortDataFormData = z.infer<typeof schema>;

// export const parseData = (data: SortDataFormData) => {
//   const parsedData = schema.safeParse(data);
//   if (!parsedData.success) {
//     toast.error(`Error parsing data: ${parsedData.error.errors}`);
//     return;
//   }
//   return {
//     sort_columns: parsedData.data.sort_columns.map((column) => column.name),
//     ascending: parsedData.data.sort_columns.map(
//       (column) => column.order === "ascending",
//     ),
//   };
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const mapToDefaultValues = (data: any, columns: string[]): SortDataFormData => {
//   if (!data || Object.keys(data).length === 0) {
//     return {
//       sort_columns: [
//         {
//           name: columns?.[0],
//           order: "ascending",
//         },
//       ],
//     };
//   }

//   const sortColumns: { name: string; order: "ascending" | "descending" }[] = [];

//   for (let i = 0; i < data.sort_columns.length; i++) {
//     sortColumns.push({
//       name: data.sort_columns[i],
//       order: data.ascending?.[i] ? "ascending" : "descending",
//     });
//   }

//   return {
//     sort_columns: sortColumns,
//   };
// };
