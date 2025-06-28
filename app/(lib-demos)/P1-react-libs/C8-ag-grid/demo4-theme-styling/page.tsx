"use client";

import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  CellClassRules,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowClassRules,
  RowSelectionOptions,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const ragCellClassRules: CellClassRules = {
  // apply green to electric cars
  "rag-green": (params) => params.value === true,
};

const Page = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState<any[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Vauxhall", model: "Corsa", price: 18460, electric: false },
    { make: "Volvo", model: "EX30", price: 33795, electric: true },
    { make: "Mercedes", model: "Maybach", price: 175720, electric: false },
    { make: "Vauxhall", model: "Astra", price: 25795, electric: false },
    { make: "Fiat", model: "Panda", price: 13724, electric: false },
    { make: "Jaguar", model: "I-PACE", price: 69425, electric: true },
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "make",
    },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
    {
      field: "electric",
      cellClassRules: ragCellClassRules, //! custom cell styling
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
    };
  }, []);

  //! custom row styling
  const rowClassRules = useMemo<RowClassRules>(() => {
    return {
      // apply red to Ford cars
      "rag-red": (params) => params.data.make === "Ford",
    };
  }, []);

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      headerCheckbox: false,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowClassRules={rowClassRules}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

export default Page;
