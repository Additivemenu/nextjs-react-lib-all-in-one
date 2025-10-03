import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, CellClassParams } from "ag-grid-community";
import { CellReference } from "../types/index";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

interface SpreadsheetGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  selectedCellRefs?: CellReference[];
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  rowData,
  columnDefs,
  selectedCellRefs = [],
}) => {
  // Function to determine if a cell should be highlighted
  const getCellClass = (params: CellClassParams) => {
    const rowIndex = params.node.rowIndex;
    const colIndex = columnDefs.findIndex(
      (col) => col.field === params.colDef.field,
    );

    //! Check if this cell is in the selected range
    const isSelected = selectedCellRefs.some(
      (ref) => ref.row === rowIndex && ref.col === colIndex,
    );

    return isSelected ? "selected-cell" : "";
  };

  // Update column definitions to include cell class function
  const enhancedColumnDefs = columnDefs.map((colDef) => ({
    ...colDef,
    cellClass: getCellClass,
  }));

  return (
    <>
      <style jsx>{`
        :global(.ag-theme-alpine .selected-cell) {
          background-color: #e3f2fd !important;
          border: 2px solid #2196f3 !important;
          box-shadow: inset 0 0 0 1px #2196f3 !important;
        }
        :global(.ag-theme-alpine .selected-cell:hover) {
          background-color: #bbdefb !important;
        }
      `}</style>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={enhancedColumnDefs}
          enableRangeSelection={false}
          suppressRowClickSelection={true}
          animateRows={true}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
        />
      </div>
    </>
  );
};
