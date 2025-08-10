"use client";

import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Import our modular components and utilities
import {
  FileUploadSection,
  RangeSelectionSection,
  SpreadsheetGrid,
  SelectedDataDisplay,
} from "./components";
import { UploadFormData } from "./types";
import { uploadFormSchema } from "./schemas/validation";
import { parseRange, getCellRange, scrollToCell } from "./utils/excel-helpers";
import { processFile } from "./utils/file-processor";
import {
  spreadsheetReducer,
  initialSpreadsheetState,
} from "./reducers/spreadsheet-reducer";

export default function SpreadsheetUploadPage() {
  const [state, dispatch] = useReducer(
    spreadsheetReducer,
    initialSpreadsheetState,
  );

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      cellRange: "",
    },
  });

  // Watch the cellRange field to get its current value
  const cellRangeValue = form.watch("cellRange") || "";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Processing file...");
      const result = await processFile(file);

      dispatch({
        type: "SET_DATA",
        payload: {
          data: result.data,
          columnDefs: result.columnDefs,
        },
      });

      toast.dismiss();
      toast.success(
        `File uploaded successfully! ${result.data.length} rows loaded.`,
      );
    } catch (error) {
      toast.dismiss();
      toast.error(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const onSubmit = (data: UploadFormData) => {
    // Handle complete form submission with both file and range
    console.log("Form submitted with data:", {
      file: data.file?.[0]?.name,
      cellRange: data.cellRange,
    });

    // If there's a cell range and data is loaded, update selection
    if (data.cellRange?.trim() && state.data.length > 0) {
      handleUpdateSelection();
    }
  };

  //! core
  const handleUpdateSelection = () => {
    if (!cellRangeValue?.trim()) return;

    const cellRefs = parseRange(cellRangeValue);
    if (!cellRefs) return;

    const result = getCellRange(state.data, state.columnDefs, cellRefs);
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: result.data,
        range: result.range,
        cellRefs: cellRefs,
      },
    });

    // Scroll to the first cell in the range
    if (cellRefs.length > 0 && cellRefs[0].row >= 0 && cellRefs[0].col >= 0) {
      scrollToCell(cellRefs[0].col, cellRefs[0].row);
    }
  };

  const handleClearSelection = () => {
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: [],
        range: "",
        cellRefs: [],
      },
    });
    form.setValue("cellRange", "");
  };

  const handleCopyData = () => {
    if (state.selectedData.length === 0) return;

    const csvContent = [
      Object.keys(state.selectedData[0]).join(","),
      ...state.selectedData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    navigator.clipboard.writeText(csvContent);
    toast.success("Data copied to clipboard!");
  };

  const handleDownloadData = () => {
    if (state.selectedData.length === 0) return;

    const csvContent = [
      Object.keys(state.selectedData[0]).join(","),
      ...state.selectedData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected_data_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data downloaded successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Spreadsheet Upload & Range Selection</CardTitle>
          <CardDescription>
            Upload a CSV or Excel file and select specific ranges by typing cell
            references (e.g., A1:C10)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FileUploadSection
              register={form.register}
              handleFileChange={handleFileChange}
              errors={form.formState.errors}
            />

            {state.data.length > 0 && (
              <RangeSelectionSection
                register={form.register}
                errors={form.formState.errors}
                onUpdateSelection={handleUpdateSelection}
                onClearSelection={handleClearSelection}
                hasSelection={state.selectedData.length > 0}
                cellRangeValue={cellRangeValue}
              />
            )}
          </form>

          {state.data.length > 0 && (
            <>
              <SpreadsheetGrid
                rowData={state.data}
                columnDefs={state.columnDefs}
                selectedCellRefs={state.selectedCellRefs}
              />

              <SelectedDataDisplay
                selectedData={state.selectedData}
                selectedRange={state.selectedRange}
                onCopyData={handleCopyData}
                onDownloadData={handleDownloadData}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
