"use client";

import { readmePath } from "./readme-path";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useState } from "react";
import type { ColDef } from "ag-grid-community"; // Import ColDef type
import PageToolbar from "@/app/_components/toolbars/page-toolbar";

export default function Page() {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);
  const defaultColDef: ColDef = {
    flex: 1,
  };
  return (
    // Data Grid will fill the size of the parent container
    <>
      <PageToolbar readmePath={readmePath} />
      <div style={{ width: 800, height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </>
  );
}
