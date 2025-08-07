import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import { useMemo } from "react";
import { CountryFlagRenderer } from "../cell-renderers/country-flag-renderer";
import { ElectricVehicleRenderer } from "../cell-renderers/electric-vehicle-renderer";
import { ModelRenderer } from "../cell-renderers/model-renderer";

export const useColDefsBuilders = () => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // All columns will be resizable by default
      resizable: true,
      // All columns will have a flex width of 1, so they fill the available space
      flex: 1,
      minWidth: 150,
      // Enable sorting by default
      sortable: true,
      // Enable filtering by default
      filter: true,
      // Make all columns editable by default (will be overridden where needed)
      editable: true,
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
        //! Pinned to the left so it's always visible
        pinned: "left",
        editable: false,
        sortable: false,
        filter: false,
      },
      {
        field: "make",
        headerName: "Manufacturer",
        sortable: true,
        // Use the standard text filter with additional options
        filter: "agTextColumnFilter",
        filterParams: {
          buttons: ["reset", "apply"],
          caseSensitive: false,
        },
        editable: true,
        // Add cell styling based on value
        cellClass: (params) => {
          if (params.value === "Tesla") return "highlight-tesla";
          return "";
        },
        // Add tooltips
        tooltipField: "make",
      },
      {
        field: "model",
        headerName: "Model Name",
        sortable: true,
        filter: "agTextColumnFilter",
        editable: true,
        tooltipField: "model",
        // Add custom cell renderer for models
        cellRenderer: ModelRenderer,
      },
      {
        field: "price",
        headerName: "Price (USD)",
        sortable: true,
        // Use the standard number filter with range options
        filter: "agNumberColumnFilter",
        filterParams: {
          buttons: ["reset", "apply"],
          allowedCharPattern: "\\d\\-\\,\\.",
        },
        editable: true,
        //! Formats the number as currency
        valueFormatter: (params: ValueFormatterParams) => {
          if (params.value == null) return "";
          return "$" + params.value.toLocaleString();
        },
        // Add cell styling based on price ranges
        cellClass: (params) => {
          if (params.value > 50000) return "price-high";
          if (params.value < 30000) return "price-low";
          return "price-medium";
        },
        // Add custom validation
        cellEditorParams: {
          min: 0,
          max: 200000,
        },
        // Sort by numeric value
        comparator: (valueA: number, valueB: number) => valueA - valueB,
      },
      {
        //! 'electric' column with enhanced styling
        field: "electric",
        headerName: "Electric Vehicle",
        sortable: true,
        // Custom cell renderer to display electric/gas with icons
        cellRenderer: ElectricVehicleRenderer,
        // Add cell styling based on electric status
        cellClass: (params) => {
          return params.value ? "electric-true" : "electric-false";
        },
        // Boolean filter instead of no filter
        filter: "agSetColumnFilter",
        filterParams: {
          values: [true, false],
          valueFormatter: (params: any) => (params.value ? "Electric" : "Gas"),
        },
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
          valueListGap: 0,
        },
      },
      {
        field: "availableDate",
        headerName: "Available From",
        sortable: true,
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
