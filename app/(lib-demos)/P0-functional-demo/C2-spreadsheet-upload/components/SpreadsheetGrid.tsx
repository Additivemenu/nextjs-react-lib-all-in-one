import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RangeSelectionChangedEvent } from "ag-grid-community";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

interface SpreadsheetGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  onRangeSelectionChanged: (event: RangeSelectionChangedEvent) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  rowData,
  columnDefs,
  onRangeSelectionChanged,
}) => {
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        enableRangeSelection={true}
        onRangeSelectionChanged={onRangeSelectionChanged}
        suppressRowClickSelection={true}
        rowSelection="multiple"
        animateRows={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
        }}
      />
    </div>
  );
};
