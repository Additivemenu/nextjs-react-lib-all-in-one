"use client";

import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "./styles.css";

import { useGridConfiguration } from "./hooks/use-grid-configuration";
import {
  HookDocumentationSection,
  SelectedParamsSection,
  InteractionsSection,
  ParamsPropertiesSection,
  AdvancedFeaturesSection,
} from "./components/documentation-sections";

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const Page = () => {
  const gridRef = useRef<AgGridReact>(null);

  const {
    rowData,
    columnDefs,
    defaultColDef,
    gridContext,
    selectedParams,
    onGridReady,
    onCellClicked,
  } = useGridConfiguration();

  return (
    <div className="min-h-screen overflow-auto">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AG-Grid Hooks & Params Demo
          </h1>
          <p className="text-gray-600 mb-4">
            This demo showcases how various AG-Grid hooks use the `params`
            object to access cell values, row data, column information, and grid
            context.
          </p>

          <HookDocumentationSection selectedParams={selectedParams} />
          <SelectedParamsSection selectedParams={selectedParams} />
        </div>

        <div className="ag-theme-quartz h-80 border rounded-lg shadow-sm">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            context={gridContext}
            onGridReady={onGridReady}
            onCellClicked={onCellClicked}
            animateRows={true}
            rowSelection="multiple"
            suppressRowClickSelection={true}
          />
        </div>

        <div className="space-y-4">
          <InteractionsSection />
          <ParamsPropertiesSection />
          <AdvancedFeaturesSection />
        </div>
      </div>
    </div>
  );
};

export default Page;
