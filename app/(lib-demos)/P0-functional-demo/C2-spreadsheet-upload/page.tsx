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
import {
  useFileUpload,
  useRangeSelection,
  useDataOperations,
  useSpreadsheetSelectors,
} from "./hooks";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import { readmePath } from "./readme-path";

export default function SpreadsheetUploadPage() {
  const [state, dispatch] = useReducer(
    spreadsheetReducer,
    initialSpreadsheetState,
  );
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const [headerRowIndex, setHeaderRowIndex] = React.useState<number>(0);

  // 🔄 Compute derived state from source state
  const { selectedCellRefs, selectedData, selectedRangeDescription } =
    useSpreadsheetSelectors(state);

  const form = useForm({
    defaultValues: {
      cellRange: "",
    },
  });

  // Watch form fields to get their current values
  const cellRangeValue = form.watch("cellRange") || "";

  // Custom hooks for handling different aspects of the application
  const { handleFileChange, handleHeaderRowChange } = useFileUpload(
    dispatch,
    headerRowIndex,
  );
  const { handleUpdateSelection, handleClearSelection } = useRangeSelection(
    state,
    dispatch,
    (field: string, value: any) => form.setValue("cellRange", value),
  );
  const { handleCopyData, handleDownloadData } = useDataOperations();

  const onSubmit = (data: { cellRange: string }) => {
    // Handle complete form submission with both file and range
    console.log("Form submitted with data:", {
      file: currentFile?.name,
      cellRange: data.cellRange,
      headerRowIndex: headerRowIndex,
    });

    // If there's a cell range and data is loaded, update selection
    if (data.cellRange?.trim() && state.data.length > 0) {
      handleUpdateSelection(cellRangeValue);
    }
  };

  // Wrapper functions for the hook handlers
  const onUpdateSelection = () => handleUpdateSelection(cellRangeValue);
  const onClearSelection = () => handleClearSelection();

  // Handler for header row changes
  const onHeaderRowChange = (newHeaderRowIndex: number) => {
    if (currentFile) {
      setHeaderRowIndex(newHeaderRowIndex);
      handleHeaderRowChange(newHeaderRowIndex, currentFile);
    }
  };

  // Enhanced file change handler
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile(file);
    }
    handleFileChange(event);
  };

  // Wrapper functions for data operations with derived state
  const onCopyData = () => handleCopyData(selectedData);
  const onDownloadData = () =>
    handleDownloadData(selectedData, selectedRangeDescription);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <PageToolbar readmePath={readmePath} />

        <CardHeader>
          <CardTitle>Spreadsheet Upload & Range Selection</CardTitle>
          <CardDescription>
            Upload a CSV or Excel file and select specific ranges by typing cell
            references (e.g., A1:C10). Choose which row contains your headers if
            it&apos;s not the first row.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FileUploadSection
              onFileChange={onFileChange}
              onHeaderRowChange={onHeaderRowChange}
              errors={form.formState.errors}
              hasData={state.data.length > 0}
              headerRowIndex={headerRowIndex}
            />

            {state.data.length > 0 && (
              <RangeSelectionSection
                register={form.register}
                errors={form.formState.errors}
                onUpdateSelection={onUpdateSelection}
                onClearSelection={onClearSelection}
                hasSelection={selectedData.length > 0}
                cellRangeValue={cellRangeValue}
              />
            )}
          </form>

          {state.data.length > 0 && (
            <>
              <SpreadsheetGrid
                rowData={state.data} //! dynamic
                columnDefs={state.columnDefs} // ! this is also dynamic!
                selectedCellRefs={selectedCellRefs}
              />

              <SelectedDataDisplay
                selectedData={selectedData}
                selectedRange={selectedRangeDescription}
                onCopyData={onCopyData}
                onDownloadData={onDownloadData}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
