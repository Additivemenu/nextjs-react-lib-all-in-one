"use client";

import React, { useReducer, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RangeSelectionChangedEvent } from "ag-grid-community";
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
  const [rangeInput, setRangeInput] = useState("");
  const gridRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
  });

  const isValidRange = rangeInput ? parseRange(rangeInput) !== null : false;

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
    // Form submission is handled by file change
    console.log("Form submitted", data);
  };

  const handleRangeSelectionChanged = (event: RangeSelectionChangedEvent) => {
    if (!event.finished) return;

    const ranges = event.api.getCellRanges();
    if (!ranges || ranges.length === 0) {
      dispatch({ type: "SET_SELECTION", payload: { data: [], range: "" } });
      return;
    }

    // Get the first range
    const range = ranges[0];
    const startRow = range.startRow?.rowIndex ?? 0;
    const endRow = range.endRow?.rowIndex ?? 0;

    // Get column indices from the range
    const allColumns = event.api.getColumns();
    const startColIndex =
      allColumns?.findIndex((col) => col === range.columns[0]) ?? 0;
    const endColIndex =
      allColumns?.findIndex(
        (col) => col === range.columns[range.columns.length - 1],
      ) ?? 0;

    // Create cell references for the selected range
    const cellRefs = [];
    for (
      let row = Math.min(startRow, endRow);
      row <= Math.max(startRow, endRow);
      row++
    ) {
      for (
        let col = Math.min(startColIndex, endColIndex);
        col <= Math.max(startColIndex, endColIndex);
        col++
      ) {
        cellRefs.push({ col: col, row });
      }
    }

    const result = getCellRange(state.data, state.columnDefs, cellRefs);
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: result.data,
        range: result.range,
      },
    });

    // Update range input to reflect the selection
    const startColLetter = String.fromCharCode(
      65 + Math.min(startColIndex, endColIndex),
    );
    const endColLetter = String.fromCharCode(
      65 + Math.max(startColIndex, endColIndex),
    );
    const rangeString = `${startColLetter}${
      Math.min(startRow, endRow) + 1
    }:${endColLetter}${Math.max(startRow, endRow) + 1}`;
    setRangeInput(rangeString);
  };

  const handleUpdateSelection = () => {
    if (!isValidRange || !rangeInput.trim()) return;

    const cellRefs = parseRange(rangeInput);
    if (!cellRefs) return;

    const result = getCellRange(state.data, state.columnDefs, cellRefs);
    dispatch({
      type: "SET_SELECTION",
      payload: {
        data: result.data,
        range: result.range,
      },
    });

    // Scroll to the first cell in the range
    if (cellRefs.length > 0 && cellRefs[0].row >= 0 && cellRefs[0].col >= 0) {
      scrollToCell(cellRefs[0].col, cellRefs[0].row);
    }
  };

  const handleClearSelection = () => {
    dispatch({ type: "SET_SELECTION", payload: { data: [], range: "" } });
    setRangeInput("");

    // Clear AG Grid selection
    if (gridRef.current?.api) {
      gridRef.current.api.clearRangeSelection();
    }
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
            Upload a CSV or Excel file, then select specific ranges of data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FileUploadSection
              register={register}
              handleFileChange={handleFileChange}
              errors={errors}
            />
          </form>

          {state.data.length > 0 && (
            <>
              <RangeSelectionSection
                rangeInput={rangeInput}
                setRangeInput={setRangeInput}
                isValidRange={isValidRange}
                onUpdateSelection={handleUpdateSelection}
                onClearSelection={handleClearSelection}
                hasSelection={state.selectedData.length > 0}
              />

              <SpreadsheetGrid
                rowData={state.data}
                columnDefs={state.columnDefs}
                onRangeSelectionChanged={handleRangeSelectionChanged}
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
