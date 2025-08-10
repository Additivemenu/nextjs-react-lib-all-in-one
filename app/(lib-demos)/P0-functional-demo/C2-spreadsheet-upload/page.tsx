"use client";

import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Import our modular components, utilities, and hooks
import {
  FileUploadSection,
  RangeSelectionSection,
  SpreadsheetGrid,
  SelectedDataDisplay,
} from "./components";
import { UploadFormData } from "./types";
import { uploadFormSchema } from "./schemas/validation";
import {
  spreadsheetReducer,
  initialSpreadsheetState,
} from "./reducers/spreadsheet-reducer";
import { useFileUpload, useRangeSelection, useDataOperations } from "./hooks";

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

  // Custom hooks for handling different aspects of the application
  // Using first row as headers (defaultHeaderRow = 0)
  const { handleFileChange } = useFileUpload(dispatch, 0);
  const { handleUpdateSelection, handleClearSelection } = useRangeSelection(
    state,
    dispatch,
    form.setValue,
  );
  const { handleCopyData, handleDownloadData } = useDataOperations(
    state.selectedData,
  );

  const onSubmit = (data: UploadFormData) => {
    // Handle complete form submission with both file and range
    console.log("Form submitted with data:", {
      file: data.file?.[0]?.name,
      cellRange: data.cellRange,
    });

    // If there's a cell range and data is loaded, update selection
    if (data.cellRange?.trim() && state.data.length > 0) {
      handleUpdateSelection(cellRangeValue);
    }
  };

  // Wrapper functions for the hook handlers
  const onUpdateSelection = () => handleUpdateSelection(cellRangeValue);
  const onClearSelection = () => handleClearSelection();

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
              onFileChange={handleFileChange}
              errors={form.formState.errors}
            />

            {state.data.length > 0 && (
              <RangeSelectionSection
                register={form.register}
                errors={form.formState.errors}
                onUpdateSelection={onUpdateSelection}
                onClearSelection={onClearSelection}
                hasSelection={state.selectedData.length > 0}
                cellRangeValue={cellRangeValue}
              />
            )}
          </form>

          {state.data.length > 0 && (
            <>
              <SpreadsheetGrid
                rowData={state.data} //! dynamic
                columnDefs={state.columnDefs} // ! this is also dynamic!
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
