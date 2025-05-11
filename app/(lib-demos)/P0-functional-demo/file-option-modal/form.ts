// import { toast } from '@/lib/toast-manager/toastmanager';
import { z } from "zod";

import { Upload } from "@/store/workflow/add-file-modal";

import { getFileType } from "./_utils/get-file-type";

const CELL_RANGE_REGEX = /^([A-Z]+)(\d+)$/;

// Helper function to validate cell format
export const isCellValid = (cell: string) =>
  CELL_RANGE_REGEX.test(cell) || cell === "";

// Helper function to compare cell positions
const isCellBefore = (cell1: string, cell2: string) => {
  const [, col1, row1] = cell1.match(CELL_RANGE_REGEX) || [];
  const [, col2, row2] = cell2.match(CELL_RANGE_REGEX) || [];

  // console.log("cols1 row1", col1, row1);
  // console.log("cols2 row2", col2, row2);

  return col1 <= col2 && parseInt(row1) <= parseInt(row2);
};

function excelColumnStrToColumnIndex(column: string): number {
  if (!/^[A-Z]+$/.test(column)) {
    return -1;
  }

  let columnNumber = 0;

  for (let i = 0; i < column.length; i++) {
    const charCode = column.charCodeAt(i) - 65 + 1; // Convert 'A' -> 1, 'B' -> 2, ... 'Z' -> 25, 'AA' -> 26 etc.
    columnNumber = columnNumber * 26 + charCode;
  }

  return columnNumber - 1; // Convert to zero-based index
}

export const getColumnIndexBound = ({
  startingCell,
  endingCell,
}: {
  startingCell: string;
  endingCell: string;
}) => {
  const [, col1] = startingCell.match(CELL_RANGE_REGEX) || [];
  const [, col2] = endingCell.match(CELL_RANGE_REGEX) || [];

  const leftBoundIndex = excelColumnStrToColumnIndex(col1);
  const rightBoundIndex = excelColumnStrToColumnIndex(col2);

  return {
    leftBoundIndex,
    rightBoundIndex,
  };
};

// Helper function to extract row number from a cell string
const getRowNumber = (cell: string) => {
  const match = cell.match(/^[A-Z]+(\d+)$/);
  return match ? parseInt(match[1]) : 0;
};

// ============================================================================
const baseSchema = z.object({
  headerRowNumber: z.number().int().min(1),
  selectedHeaders: z
    .array(z.string())
    .refine((headers) => headers.length > 0, {
      message: "Please select at least one header to proceed.",
    })
    .refine(
      (headers) => {
        const uniqueHeaders = new Set(headers);
        return uniqueHeaders.size === headers.length;
      },
      { message: "Please deselect duplicated headers to proceed" },
    ),
});

/**
 * split into csv and excel handler (helper function) in context
 *
 */
export const csvSchema = baseSchema.extend({
  fileType: z.literal("csv"),
});
export type CsvFormData = z.infer<typeof csvSchema>;

export const excelSchema = baseSchema.extend({
  fileType: z.literal("excel"),
  isCellRangeCheckboxOn: z.boolean(),
  startingCell: z.union([
    z.literal(""),
    z.string().refine(isCellValid, {
      message: "Invalid cell format. Please follow the format: A1, B2, ...",
    }),
  ]),
  endingCell: z.union([
    z.literal(""),
    z.string().refine(isCellValid, {
      message: "Invalid cell format. Please follow the format: A1, B2, ...",
    }),
  ]),
});
export type ExcelFormData = z.infer<typeof excelSchema>;

// we should apply refine() to discriminatedUnion instead of schema, see reference https://stackoverflow.com/questions/74790564/validate-field-in-discriminated-union-based-on-other-field-in-zod
export const fileOptionFormSchema = z
  .discriminatedUnion("fileType", [csvSchema, excelSchema])
  .superRefine((data, ctx) => {
    // these superRefine() are used to do cross-field validations
    if (data.fileType !== "excel") {
      return; // No need to validate for non-Excel file types
    }

    if (!data.isCellRangeCheckboxOn) {
      return; // No need to validate if cell range check is off
    }

    const headerRowNumberValidationResult =
      getRowNumber(data.startingCell) > data.headerRowNumber;
    if (!headerRowNumberValidationResult) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Header row number must be less than the starting cell row number",
        path: ["headerRowNumber"],
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.fileType !== "excel") {
      return; // No need to validate for non-Excel file types
    }

    if (!data.isCellRangeCheckboxOn) {
      return; // No need to validate if cell range check is off
    }

    const isCellBeforeCheckResult = isCellBefore(
      data.startingCell,
      data.endingCell,
    );

    if (!isCellBeforeCheckResult) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Starting cell must be top left to the ending cell",
        path: ["startingCell"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ending cell must be bottom right to the starting cell",
        path: ["endingCell"],
      });
    }
  });

export type FileOptionFormData = z.infer<typeof fileOptionFormSchema>;

export const parseFormDataToStore = (formData: FileOptionFormData) => {
  const useColsJsonString =
    JSON.stringify(
      formData.selectedHeaders.filter(
        (str): str is string => str !== undefined,
      ),
    ) ?? "";

  if (formData.fileType === "csv") {
    return {
      // fileType: "csv",
      headerRowNumber: formData.headerRowNumber,
      useCols: useColsJsonString,
    };
  } else if (formData.fileType === "excel") {
    const cellRangeString = formData.isCellRangeCheckboxOn
      ? `${formData.startingCell}:${formData.endingCell}`
      : ":";

    return {
      // fileType: "excel",
      // isCellRangeCheckboxOn: formData.isCellRangeCheckboxOn,
      headerRowNumber: formData.headerRowNumber,
      cellRange: cellRangeString,
      useCols: useColsJsonString,
    };
  } else {
    throw new Error("Unknown file type");
  }
};

export const parseStoreToFormData: (upload: Upload) => FileOptionFormData = (
  upload: Upload,
) => {
  const fileType = getFileType(upload.fileToUpload);

  if (fileType === "csv") {
    return {
      fileType: "csv",
      headerRowNumber: upload.headerRowNumber,
      selectedHeaders: JSON.parse(upload.useCols),
    };
  } else if (fileType === "excel") {
    return {
      fileType: "excel",
      headerRowNumber: upload.headerRowNumber,
      isCellRangeCheckboxOn: upload.cellRange !== ":",
      startingCell: upload.cellRange.split(":")[0],
      endingCell: upload.cellRange.split(":")[1],
      selectedHeaders: JSON.parse(upload.useCols),
    };
  } else {
    throw new Error("Unknown file type");
  }
};
