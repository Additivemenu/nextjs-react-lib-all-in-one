"use client";

import React, { useCallback, useReducer, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RangeSelectionChangedEvent } from "ag-grid-community";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// // AG Grid styles
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// Zod schema for form validation
const uploadSchema = z.object({
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

type UploadFormData = z.infer<typeof uploadSchema>;

// Types for the state management
interface SpreadsheetState {
  data: any[][];
  headers: string[];
  columnDefs: ColDef[];
  rowData: Record<string, any>[];
  selectedRange: {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null;
  fileName: string | null;
}

type SpreadsheetAction =
  | { type: "SET_DATA"; payload: { data: any[][]; fileName: string } }
  | { type: "SET_SELECTION"; payload: SpreadsheetState["selectedRange"] }
  | { type: "CLEAR_DATA" };

// Reducer for managing spreadsheet state
const spreadsheetReducer = (
  state: SpreadsheetState,
  action: SpreadsheetAction,
): SpreadsheetState => {
  switch (action.type) {
    case "SET_DATA": {
      const { data, fileName } = action.payload;
      const headers =
        data[0]?.map(
          (_, index) => `Column ${String.fromCharCode(65 + index)}`,
        ) || [];

      const columnDefs: ColDef[] = headers.map((header, index) => ({
        field: `col${index}`,
        headerName: header,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 100,
      }));

      const rowData = data.slice(1).map((row, rowIndex) => {
        const rowObj: Record<string, any> = {};
        row.forEach((cell, colIndex) => {
          rowObj[`col${colIndex}`] = cell;
        });
        return rowObj;
      });

      return {
        ...state,
        data,
        headers,
        columnDefs,
        rowData,
        fileName,
        selectedRange: null,
      };
    }
    case "SET_SELECTION":
      return {
        ...state,
        selectedRange: action.payload,
      };
    case "CLEAR_DATA":
      return {
        data: [],
        headers: [],
        columnDefs: [],
        rowData: [],
        selectedRange: null,
        fileName: null,
      };
    default:
      return state;
  }
};

// Helper function to convert column index to Excel column letter
const getColumnLetter = (index: number): string => {
  let result = "";
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

// Helper function to convert Excel column letter to index
const getColumnIndex = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
};

// Helper function to parse cell reference like "A1"
const parseCellReference = (
  cellRef: string,
): { row: number; col: number } | null => {
  const match = cellRef.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;

  const col = getColumnIndex(match[1]);
  const row = parseInt(match[2]) - 1; // Convert to 0-based index

  return { row, col };
};

const SpreadsheetUploadPage = () => {
  const [state, dispatch] = useReducer(spreadsheetReducer, {
    data: [],
    headers: [],
    columnDefs: [],
    rowData: [],
    selectedRange: null,
    fileName: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const watchedFile = watch("file");
  const watchedStartCell = watch("startCell");
  const watchedEndCell = watch("endCell");

  // File processing function
  const processFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let worksheet: XLSX.WorkSheet;

        if (file.type === "text/csv") {
          const csvData = data as string;
          const workbook = XLSX.read(csvData, { type: "string" });
          worksheet = workbook.Sheets[workbook.SheetNames[0]];
        } else {
          const workbook = XLSX.read(data, { type: "array" });
          worksheet = workbook.Sheets[workbook.SheetNames[0]];
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        if (jsonData.length === 0) {
          toast.error("The file appears to be empty");
          return;
        }

        dispatch({
          type: "SET_DATA",
          payload: { data: jsonData, fileName: file.name },
        });
        toast.success("File loaded successfully");
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please check the file format.");
      }
    };

    if (file.type === "text/csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  // Handle file selection
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile],
  );

  // Handle range selection from AG Grid
  const onRangeSelectionChanged = useCallback(
    (event: RangeSelectionChangedEvent) => {
      const rangeSelections = event.api.getCellRanges();
      if (rangeSelections && rangeSelections.length > 0) {
        const range = rangeSelections[0];
        const startRow = range.startRow?.rowIndex || 0;
        const endRow = range.endRow?.rowIndex || 0;
        const startCol = range.columns[0].getColId();
        const endCol = range.columns[range.columns.length - 1].getColId();

        // Extract column indices from field names (col0, col1, etc.)
        const startColIndex = parseInt(startCol.replace("col", ""));
        const endColIndex = parseInt(endCol.replace("col", ""));

        const selection = {
          startRow,
          startCol: startColIndex,
          endRow,
          endCol: endColIndex,
        };

        dispatch({ type: "SET_SELECTION", payload: selection });

        // Update form fields with cell references
        const startCellRef = `${getColumnLetter(startColIndex)}${startRow + 1}`;
        const endCellRef = `${getColumnLetter(endColIndex)}${endRow + 1}`;

        setValue("startCell", startCellRef);
        setValue("endCell", endCellRef);
      }
    },
    [setValue],
  );

  // Handle manual cell reference input
  const updateSelectionFromCellRefs = useCallback(() => {
    if (!watchedStartCell || !watchedEndCell) return;

    const start = parseCellReference(watchedStartCell);
    const end = parseCellReference(watchedEndCell);

    if (start && end) {
      const selection = {
        startRow: Math.min(start.row, end.row),
        startCol: Math.min(start.col, end.col),
        endRow: Math.max(start.row, end.row),
        endCol: Math.max(start.col, end.col),
      };

      dispatch({ type: "SET_SELECTION", payload: selection });
    }
  }, [watchedStartCell, watchedEndCell]);

  // Update selection when cell references change
  React.useEffect(() => {
    updateSelectionFromCellRefs();
  }, [updateSelectionFromCellRefs]);

  // Custom cell renderer to highlight selected range
  const cellClassRules = useMemo(
    () => ({
      "bg-blue-200 border border-blue-400": (params: any) => {
        if (!state.selectedRange) return false;

        const colIndex = parseInt(params.colDef.field.replace("col", ""));
        const rowIndex = params.node.rowIndex;

        return (
          rowIndex >= state.selectedRange.startRow &&
          rowIndex <= state.selectedRange.endRow &&
          colIndex >= state.selectedRange.startCol &&
          colIndex <= state.selectedRange.endCol
        );
      },
    }),
    [state.selectedRange],
  );

  // Update column definitions with cell class rules
  const columnDefsWithStyles = useMemo(() => {
    return state.columnDefs.map((colDef) => ({
      ...colDef,
      cellClassRules,
    }));
  }, [state.columnDefs, cellClassRules]);

  // Form submission handler
  const onSubmit = (data: UploadFormData) => {
    if (state.data.length === 0) {
      toast.error("Please upload a file first");
      return;
    }

    let dataToUpload = state.data;

    // If a range is selected, extract only that range
    if (state.selectedRange) {
      const { startRow, startCol, endRow, endCol } = state.selectedRange;
      dataToUpload = state.data
        .slice(startRow, endRow + 1)
        .map((row) => row.slice(startCol, endCol + 1));
    }

    // Here you would typically send the data to your server
    console.log("Data to upload:", {
      fileName: state.fileName,
      selectedRange: state.selectedRange,
      data: dataToUpload,
    });

    toast.success(
      "Data would be uploaded to server (check console for details)",
    );
  };

  const clearData = () => {
    dispatch({ type: "CLEAR_DATA" });
    // Reset form fields
    setValue("file", null);
    setValue("startCell", "");
    setValue("endCell", "");
    // Clear file input manually
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    toast.info("Data cleared");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>Spreadsheet Upload</CardTitle>
          <CardDescription>
            Upload CSV or Excel files and select data ranges for processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium mb-2">
                Select File (CSV or Excel)
              </label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                {...register("file")}
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.file && (
                <Alert className="mt-2">
                  <AlertDescription>
                    {typeof errors.file.message === "string"
                      ? errors.file.message
                      : "Please select a valid file"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Range Selection Inputs */}
            {state.data.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="startCell"
                    className="block text-sm font-medium mb-2"
                  >
                    Start Cell (e.g., A1)
                  </label>
                  <Input
                    id="startCell"
                    placeholder="A1"
                    {...register("startCell")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="endCell"
                    className="block text-sm font-medium mb-2"
                  >
                    End Cell (e.g., E7)
                  </label>
                  <Input
                    id="endCell"
                    placeholder="E7"
                    {...register("endCell")}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit" className="flex-1">
                    Upload Selected Data
                  </Button>
                  <Button type="button" variant="outline" onClick={clearData}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* File Info */}
          {state.fileName && (
            <Alert>
              <AlertDescription>
                <strong>File:</strong> {state.fileName} |<strong> Rows:</strong>{" "}
                {state.data.length} |<strong> Columns:</strong>{" "}
                {state.data[0]?.length || 0}
                {state.selectedRange && (
                  <span className="ml-2">
                    | <strong>Selected Range:</strong>{" "}
                    {getColumnLetter(state.selectedRange.startCol)}
                    {state.selectedRange.startRow + 1}:
                    {getColumnLetter(state.selectedRange.endCol)}
                    {state.selectedRange.endRow + 1}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Data Preview Grid */}
          {state.rowData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
              <div className="ag-theme-alpine h-96 w-full border rounded-lg">
                <AgGridReact
                  columnDefs={columnDefsWithStyles}
                  rowData={state.rowData}
                  enableRangeSelection={true}
                  onRangeSelectionChanged={onRangeSelectionChanged}
                  suppressRowClickSelection={false}
                  rowSelection="multiple"
                  animateRows={true}
                  pagination={true}
                  paginationPageSize={20}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                💡 Tip: Click and drag to select a range of cells, or use the
                input fields above to specify cell ranges manually.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpreadsheetUploadPage;
