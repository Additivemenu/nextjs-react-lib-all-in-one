"use client";
import React, { useMemo, useState } from "react";

import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { TABLE_DATA } from "./fake-data";

ModuleRegistry.registerModules([AllCommunityModule]);

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  headerCheckbox: false,
};

const Page = () => {
  const [rowData, setRowData] = useState(TABLE_DATA);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "make",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Tesla",
          "Ford",
          "Toyota",
          "Mercedes",
          "Fiat",
          "Nissan",
          "Vauxhall",
          "Volvo",
          "Jaguar",
        ],
      },
    },
    { field: "model" },
    { field: "price", filter: "agNumberColumnFilter" },
    { field: "electric" },
    {
      field: "month",
      comparator: (valueA: string, valueB: string) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  return (
    <div style={{ height: "600px", width: "80%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default Page;
