import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import { useMemo } from "react";
import { CountryFlagRenderer } from "../cell-renderers/country-flag-renderer";

export const useColDefsBuilders = () => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // All columns will be resizable by default
      resizable: true,
      // All columns will have a flex width of 1, so they fill the available space
      flex: 1,
      minWidth: 150,
    };
  }, []);

  /**
   * the most complex config in ag-grid
   */
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        // Checkbox selection column
        headerName: "Select",
        field: "select",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 60,
        // Pinned to the left so it's always visible
        pinned: "left",
        // Not editable, sortable, or filterable
        editable: false,
        sortable: false,
        filter: false,
      },
      {
        // 'make' column with text filter
        field: "make",
        // Enable sorting on this column
        sortable: true,
        // Use the standard text filter
        filter: "agTextColumnFilter",
        // Make this column editable
        editable: true,
      },
      {
        // 'model' column
        field: "model",
        sortable: true,
        filter: "agTextColumnFilter",
        editable: true,
      },
      {
        // 'price' column with number filter and value formatter
        field: "price",
        sortable: true,
        // Use the standard number filter
        filter: "agNumberColumnFilter",
        editable: true,
        // Formats the number as currency
        valueFormatter: (params: ValueFormatterParams) => {
          return "$" + params.value.toLocaleString();
        },
      },
      {
        // 'electric' column with a simple boolean display
        field: "electric",
        sortable: true,
        // Custom cell renderer to display a check or cross
        cellRenderer: (params: ICellRendererParams) =>
          params.value ? "✅" : "❌",
        // No filter for this simple example
        filter: false,
      },
      {
        // 'availableDate' column with date filter
        field: "availableDate",
        headerName: "Available From",
        sortable: true,
        // Use the standard date filter
        filter: "agDateColumnFilter",
        // Filter params to show a 'YYYY-MM-DD' placeholder
        filterParams: {
          comparator: (filterLocalDate: Date, cellValue: string) => {
            if (cellValue == null) return -1;
            const cellDate = new Date(cellValue);
            if (filterLocalDate.getTime() === cellDate.getTime()) return 0;
            return cellDate < filterLocalDate ? -1 : 1;
          },
        },
        editable: true,
      },
      {
        // 'country' column using a custom React component for rendering
        field: "country",
        sortable: true,
        filter: "agTextColumnFilter",
        //! Use our custom React component as the cell renderer
        cellRenderer: CountryFlagRenderer,
        editable: true,
      },
    ],
    [],
  );

  return { colDefs, defaultColDef };
};
