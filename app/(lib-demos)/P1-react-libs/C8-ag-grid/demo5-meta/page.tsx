"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { rowData as fakeRowData } from "./row-data";
import { useColDefsBuilders } from "./hooks/use-colDefs-builder";
import CustomGridToolbar from "./components/custom-grid-toolbar";
import { readmePath } from "./readme-path";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import type { GridApi, GridReadyEvent } from "ag-grid-community";
import "./styles/grid-styles.css";

//! important to register the community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Main App Component
const App: React.FC = () => {
  // Ref to access the Grid API
  const gridRef = useRef<AgGridReact>(null);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(fakeRowData);

  // Quick filter text for global search
  const [quickFilterText, setQuickFilterText] = useState("");

  //! Column Definitions: Defines the columns to be displayed.
  const { colDefs, defaultColDef } = useColDefsBuilders();

  // Grid ready callback
  const onGridReady = useCallback((event: GridReadyEvent) => {
    // Auto-size columns to fit content
    event.api.sizeColumnsToFit();
  }, []);

  // Callback function to get selected rows and log them to the console
  const handleGetSelectedRows = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      alert("No rows selected!");
      return;
    }
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataString = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(",\n");
    alert(`Selected Rows:\n${selectedDataString}`);
  }, []);

  // Callback function to clear selection
  const handleClearSelection = useCallback(() => {
    gridRef.current?.api.deselectAll();
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "ag-grid-data.csv",
      skipColumnHeaders: false,
    });
  }, []);

  // Export selected rows to CSV
  const handleExportSelectedCSV = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "ag-grid-selected-data.csv",
      skipColumnHeaders: false,
      onlySelected: true,
    });
  }, []);

  // Add new row
  const handleAddRow = useCallback(() => {
    const newRow = {
      make: "New Make",
      model: "New Model",
      price: 0,
      electric: false,
      availableDate: new Date().toISOString().split("T")[0],
      country: "United States",
    };
    setRowData((prev) => [...prev, newRow]);
  }, []);

  // Delete selected rows
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      alert("No rows selected for deletion!");
      return;
    }

    const selectedData = selectedNodes.map((node) => node.data);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedData.length} row(s)?`,
    );

    if (confirmDelete) {
      setRowData((prev) =>
        prev.filter(
          (row) =>
            !selectedData.some(
              (selected) =>
                selected.make === row.make &&
                selected.model === row.model &&
                selected.price === row.price,
            ),
        ),
      );
    }
  }, []);

  // Auto-size all columns
  const handleAutoSizeColumns = useCallback(() => {
    const allColumnIds =
      gridRef.current?.api.getColumns()?.map((col) => col.getColId()) || [];
    gridRef.current?.api.autoSizeColumns(allColumnIds);
  }, []);

  // Reset column sizes
  const handleResetColumns = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: "900px",
        width: "95%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageToolbar readmePath={readmePath} />
      <CustomGridToolbar
        // ! we handle the events in the parent component
        onGetSelectedRows={handleGetSelectedRows}
        onClearSelection={handleClearSelection}
        onExportCSV={handleExportCSV}
        onExportSelectedCSV={handleExportSelectedCSV}
        onAddRow={handleAddRow}
        onDeleteSelected={handleDeleteSelected}
        onAutoSizeColumns={handleAutoSizeColumns}
        onResetColumns={handleResetColumns}
        quickFilterText={quickFilterText}
        onQuickFilterChange={setQuickFilterText}
      />
      <div style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          //! Data -----
          rowData={rowData}
          //! Column definitions ------
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          // Selection (https://www.ag-grid.com/react-data-grid/row-selection-api-reference/) ------
          rowSelection={{ mode: "multiRow" }} // Allow multiple rows to be selected
          // Pagination settings ------
          pagination={true} // Enable pagination
          paginationPageSize={10} // Set number of rows per page
          paginationPageSizeSelector={[10, 20, 50]} // Allow user to change page size
          // Quick filter ------
          quickFilterText={quickFilterText}
          // Events ------
          onGridReady={onGridReady}
          // Additional features ------
          enableRangeSelection={true} // Enable range selection
          animateRows={true} // Animate row changes
          // Sorting ------
          multiSortKey="ctrl" // Allow multi-column sorting with Ctrl key
        />
      </div>
    </div>
  );
};

export default App;
