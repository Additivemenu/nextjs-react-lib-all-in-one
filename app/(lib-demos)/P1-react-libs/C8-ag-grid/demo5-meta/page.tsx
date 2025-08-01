"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import { rowData as fakeRowData } from "./row-data";
import { CountryFlagRenderer } from "./cell-renderers/country-flag-renderer";
import { useColDefsBuilders } from "./hooks/use-colDefs-builder";
import CustomGridToolbar from "./components/custom-grid-toolbar";

//! important to register the community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Main App Component
const App: React.FC = () => {
  // Ref to access the Grid API
  const gridRef = useRef<AgGridReact>(null);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(fakeRowData);

  // Column Definitions: Defines the columns to be displayed.
  const { colDefs, defaultColDef } = useColDefsBuilders();

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

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomGridToolbar
        // ! we handle the events in the parent component
        onGetSelectedRows={handleGetSelectedRows}
        onClearSelection={handleClearSelection}
      />
      <div style={{ flex: "1 1 0" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple" // Allow multiple rows to be selected
          suppressRowClickSelection={true} // Only select via checkbox
          // pagination settings:
          pagination={true} // Enable pagination
          paginationPageSize={10} // Set number of rows per page
          paginationPageSizeSelector={[10, 20, 50]} // Allow user to change page size
        />
      </div>
    </div>
  );
};

// Simple styling for buttons
const buttonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
};

export default App;
