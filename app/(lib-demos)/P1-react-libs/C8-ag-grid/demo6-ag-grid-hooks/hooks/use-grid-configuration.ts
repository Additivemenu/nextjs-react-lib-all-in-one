import { useCallback, useMemo, useState } from "react";
import { GridApi, GridReadyEvent, ColDef } from "ag-grid-community";
import { employeeData } from "../data/sample-data";
import { createGridContext } from "../config/grid-context";
import { createColumnDefs } from "../components/column-definitions";

export const useGridConfiguration = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedParams, setSelectedParams] = useState<any>(null);

  // Grid context for company-wide data
  const gridContext = useMemo(() => createGridContext(), []);

  // Default column definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    }),
    [],
  );

  // Column definitions
  const columnDefs = useMemo(() => createColumnDefs(), []);

  // Event handlers
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const onCellClicked = useCallback((params: any) => {
    setSelectedParams({
      field: params.colDef.field,
      value: params.value,
      rowData: params.data,
      rowIndex: params.rowIndex,
      column: params.column.getColId(),
    });
  }, []);

  return {
    // Data
    rowData: employeeData,
    columnDefs,
    defaultColDef,
    gridContext,

    // State
    gridApi,
    selectedParams,

    // Event handlers
    onGridReady,
    onCellClicked,
  };
};
