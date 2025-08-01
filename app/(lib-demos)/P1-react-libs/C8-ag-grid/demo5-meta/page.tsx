"use client";

import React, { useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { rowData as fakeRowData } from "./row-data";
import { useColDefsBuilders } from "./hooks/use-colDefs-builder";
import CustomGridToolbar from "./components/custom-grid-toolbar";
import { readmePath } from "./readme-path";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";

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
        height: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageToolbar readmePath={readmePath} />
      <CustomGridToolbar
        // ! we handle the events in the parent component
        onGetSelectedRows={handleGetSelectedRows}
        onClearSelection={handleClearSelection}
      />
      <div
        // style={{ flex: "1 1 0" }}
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          //data -----
          rowData={rowData}
          // col defs ------
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          // selection (https://www.ag-grid.com/react-data-grid/row-selection-api-reference/) ------
          rowSelection={{ mode: "multiRow" }} // Allow multiple rows to be selected
          // pagination settings ------
          pagination={true} // Enable pagination
          paginationPageSize={10} // Set number of rows per page
          paginationPageSizeSelector={[10, 20, 50]} // Allow user to change page size
        />
      </div>
    </div>
  );
};

export default App;
