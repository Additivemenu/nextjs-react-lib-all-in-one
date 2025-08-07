"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
  ICellRendererParams,
  CellClassParams,
  ITooltipParams,
} from "ag-grid-community";
import "./styles.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

// Sample data for the demo
const rowData = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    salary: 75000,
    department: "Engineering",
    startDate: "2022-01-15",
    isActive: true,
    performance: 8.5,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    salary: 85000,
    department: "Marketing",
    startDate: "2021-03-20",
    isActive: true,
    performance: 9.2,
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 45,
    salary: 95000,
    department: "Engineering",
    startDate: "2020-07-10",
    isActive: false,
    performance: 7.8,
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 29,
    salary: 70000,
    department: "HR",
    startDate: "2023-02-28",
    isActive: true,
    performance: 8.9,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 38,
    salary: 120000,
    department: "Management",
    startDate: "2019-11-05",
    isActive: true,
    performance: 9.5,
  },
];

// Custom cell renderer to demonstrate ICellRendererParams
const PerformanceRenderer = (params: ICellRendererParams) => {
  const { value, data } = params;

  // Use params to access both cell value and row data
  const getPerformanceColor = () => {
    if (value >= 9) return "text-green-600 font-bold";
    if (value >= 8) return "text-blue-600";
    if (value >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = () => {
    if (value >= 9) return "⭐";
    if (value >= 8) return "👍";
    if (value >= 7) return "👌";
    return "⚠️";
  };

  return (
    <div className="flex items-center gap-2">
      <span>{getPerformanceIcon()}</span>
      <span className={getPerformanceColor()}>{value}/10</span>
      {/* Using data from params to show additional context */}
      <span className="text-xs text-gray-500">({data.department})</span>
    </div>
  );
};

// Status renderer to show how params.value affects rendering
const StatusRenderer = (params: ICellRendererParams) => {
  const { value, data } = params;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          value ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={value ? "text-green-700" : "text-red-700"}>
        {value ? "Active" : "Inactive"}
      </span>
      {/* Show additional info using row data from params */}
      {!value && (
        <span className="text-xs text-gray-500">
          (Since {new Date(data.startDate).getFullYear()})
        </span>
      )}
    </div>
  );
};

// Advanced cell renderer demonstrating params.api usage
const ActionButtonRenderer = (params: ICellRendererParams) => {
  const { data, api, node } = params;

  const handlePromote = () => {
    // Use params.api to get selected rows and update data
    const selectedNodes = api.getSelectedNodes();
    const totalSelected = selectedNodes.length;

    // Update the current row's data using the API
    const updatedData = {
      ...data,
      performance: Math.min(data.performance + 0.5, 10),
    };
    node.setData(updatedData);

    // Show info about selected rows using the API
    alert(
      `Promoted ${data.name}! Performance: ${updatedData.performance}/10\nTotal selected rows: ${totalSelected}`,
    );

    // Refresh the grid to show changes
    api.refreshCells({ rowNodes: [node] });
  };

  const handleGetRowInfo = () => {
    // Demonstrate various API methods
    const rowCount = api.getDisplayedRowCount();
    const allRowData: any[] = [];
    api.forEachNode((node) => allRowData.push(node.data));

    const avgSalary =
      allRowData.reduce((sum, row) => sum + row.salary, 0) / allRowData.length;

    alert(`Grid Info via params.api:
- Total rows: ${rowCount}
- Average salary: $${avgSalary.toLocaleString()}
- Current row index: ${node.rowIndex}
- Row ID: ${node.id}`);
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={handlePromote}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Promote employee (uses params.api)"
      >
        📈
      </button>
      <button
        onClick={handleGetRowInfo}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        title="Show grid info (uses params.api)"
      >
        ℹ️
      </button>
    </div>
  );
};

// Advanced cell renderer demonstrating params.context usage
const BudgetAnalysisRenderer = (params: ICellRendererParams) => {
  const { data, value, context } = params;

  if (!context) return <span>{value}</span>;

  // Use params.context to access company-wide data
  const { departmentBudgets, companyName, fiscalYear } = context;
  const deptBudget = departmentBudgets[data.department] || 0;
  const salaryPercentage = ((data.salary / deptBudget) * 100).toFixed(2);

  const getBudgetStatus = () => {
    const percentage = parseFloat(salaryPercentage);
    if (percentage > 10)
      return { color: "text-red-600", icon: "🔴", status: "High" };
    if (percentage > 5)
      return { color: "text-yellow-600", icon: "🟡", status: "Medium" };
    return { color: "text-green-600", icon: "🟢", status: "Low" };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className={`text-xs font-semibold ${budgetStatus.color}`}>
          {salaryPercentage}%
        </span>
        <span>{budgetStatus.icon}</span>
      </div>
      <div className="text-xs text-gray-500">{budgetStatus.status} impact</div>
      <div className="text-xs text-gray-400">
        {companyName} {fiscalYear}
      </div>
    </div>
  );
};

const Page = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedParams, setSelectedParams] = useState<any>(null);

  // Custom context object to demonstrate params.context
  const gridContext = useMemo(
    () => ({
      companyName: "TechCorp Inc.",
      fiscalYear: 2025,
      currency: "USD",
      departmentBudgets: {
        Engineering: 2000000,
        Marketing: 1500000,
        HR: 800000,
        Management: 3000000,
      },
      performanceThreshold: 8.0,
      salaryIncrementRate: 0.05,
    }),
    [],
  );

  // Demonstrate defaultColDef with params usage
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

  // Column definitions showcasing various hooks with params
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Employee Name",
        pinned: "left",
        width: 150,
        // cellClass hook - demonstrates CellClassParams
        cellClass: (params: CellClassParams) => {
          // params contains: value, data, node, column, rowIndex, etc.
          const classes = ["font-medium"];

          // Use params.data to access other row data
          if (params.data.isActive) {
            classes.push("text-green-800");
          } else {
            classes.push("text-gray-500");
          }

          // Use params.value for value-specific styling
          if (params.value.includes("John")) {
            classes.push("bg-blue-50");
          }

          return classes.join(" ");
        },
        // tooltipField can also be a function using ITooltipParams
        tooltipValueGetter: (params: ITooltipParams) => {
          return `Employee: ${params.value}\nDepartment: ${
            params.data.department
          }\nStatus: ${params.data.isActive ? "Active" : "Inactive"}`;
        },
      },
      {
        field: "age",
        headerName: "Age",
        width: 80,
        // valueFormatter demonstrates ValueFormatterParams
        valueFormatter: (params: ValueFormatterParams) => {
          // params contains: value, data, node, colDef, column, api, context
          if (params.value == null) return "";

          // Use params.value for the main formatting
          let formatted = `${params.value} yrs`;

          // Use params.data to add contextual information
          if (params.data.age < 30) {
            formatted += " 🌱";
          } else if (params.data.age > 40) {
            formatted += " 🧓";
          }

          return formatted;
        },
        // cellStyle can also use params
        cellStyle: (params) => {
          const age = params.value;
          if (age < 30) return { backgroundColor: "#e8f5e8" };
          if (age > 40) return { backgroundColor: "#fff3e0" };
          return { backgroundColor: "#f5f5f5" };
        },
      },
      {
        field: "salary",
        headerName: "Salary",
        // Advanced valueFormatter using multiple params properties
        valueFormatter: (params: ValueFormatterParams) => {
          if (params.value == null) return "";

          // Format as currency
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }).format(params.value);

          // Add department context using params.data
          const dept = params.data.department;
          const avgSalaries = {
            Engineering: 80000,
            Marketing: 75000,
            HR: 65000,
            Management: 110000,
          };

          const avgForDept =
            avgSalaries[dept as keyof typeof avgSalaries] || 70000;
          const indicator = params.value > avgForDept ? " ↑" : " ↓";

          return formatted + indicator;
        },
        cellClass: (params) => {
          // Use both value and contextual data for styling
          const salary = params.value;
          const dept = params.data.department;

          if (salary > 100000) return "text-green-700 font-bold bg-green-50";
          if (salary < 70000) return "text-orange-600 bg-orange-50";
          return "text-blue-600";
        },
      },
      {
        field: "department",
        headerName: "Department",
        // cellClass with complex logic using params
        cellClass: (params) => {
          const dept = params.value;
          const deptColors = {
            Engineering: "bg-blue-100 text-blue-800",
            Marketing: "bg-purple-100 text-purple-800",
            HR: "bg-green-100 text-green-800",
            Management: "bg-red-100 text-red-800",
          };

          return `px-2 py-1 rounded-md text-xs font-medium ${
            deptColors[dept as keyof typeof deptColors] ||
            "bg-gray-100 text-gray-800"
          }`;
        },
      },
      {
        field: "startDate",
        headerName: "Start Date",
        // valueFormatter for date with tenure calculation
        valueFormatter: (params: ValueFormatterParams) => {
          if (!params.value) return "";

          const startDate = new Date(params.value);
          const now = new Date();
          const tenure = now.getFullYear() - startDate.getFullYear();

          // Format date and add tenure info
          const formatted = startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return `${formatted} (${tenure}y)`;
        },
        cellClass: (params) => {
          const startDate = new Date(params.value);
          const tenure = new Date().getFullYear() - startDate.getFullYear();

          if (tenure >= 4) return "text-purple-700 font-semibold";
          if (tenure >= 2) return "text-blue-700";
          return "text-green-700";
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 140,
        cellRenderer: StatusRenderer,
        // Custom filter using params
        filter: "agSetColumnFilter",
        filterParams: {
          values: [true, false],
          valueFormatter: (params: any) =>
            params.value ? "Active" : "Inactive",
        },
      },
      {
        field: "performance",
        headerName: "Performance",
        width: 180,
        cellRenderer: PerformanceRenderer,
        // Sort by performance score
        comparator: (valueA: number, valueB: number) => valueA - valueB,
      },
      {
        // Advanced column demonstrating params.api usage
        field: "actions",
        headerName: "Actions",
        width: 120,
        cellRenderer: ActionButtonRenderer,
        sortable: false,
        filter: false,
        resizable: false,
        // Pin to right for easy access
        pinned: "right",
        // Tooltip showing API capabilities
        tooltipValueGetter: (params: ITooltipParams) => {
          return `API Actions Available:
• Promote employee (params.api.refreshCells)
• Get grid statistics (params.api.getDisplayedRowCount)
• Access all row data (params.api.forEachNode)
• Check selections (params.api.getSelectedNodes)`;
        },
      },
      {
        // Advanced column demonstrating params.context usage
        field: "budgetAnalysis",
        headerName: "Budget Impact",
        width: 140,
        cellRenderer: BudgetAnalysisRenderer,
        // Use context in value getter
        valueGetter: (params) => {
          if (!params.context) return "N/A";
          const { departmentBudgets } = params.context;
          const deptBudget = departmentBudgets[params.data.department] || 0;
          return ((params.data.salary / deptBudget) * 100).toFixed(2);
        },
        // Sort by budget percentage
        comparator: (valueA: string, valueB: string) =>
          parseFloat(valueA) - parseFloat(valueB),
        // Tooltip showing context usage
        tooltipValueGetter: (params: ITooltipParams) => {
          if (!params.context) return "No context available";
          const { companyName, fiscalYear, departmentBudgets } = params.context;
          const deptBudget = departmentBudgets[params.data.department] || 0;
          return `Context Information:
Company: ${companyName}
Fiscal Year: ${fiscalYear}
Department Budget: $${deptBudget.toLocaleString()}
Employee Salary: $${params.data.salary.toLocaleString()}
Budget Impact: ${params.value}%`;
        },
      },
    ],
    [],
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Function to demonstrate accessing params in event handlers
  const onCellClicked = useCallback((params: any) => {
    setSelectedParams({
      field: params.colDef.field,
      value: params.value,
      rowData: params.data,
      rowIndex: params.rowIndex,
      column: params.column.getColId(),
    });
  }, []);

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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Demonstrated Hooks & Their Params:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>valueFormatter:</strong> Uses ValueFormatterParams
                (value, data, api, etc.)
              </li>
              <li>
                <strong>cellClass:</strong> Uses CellClassParams (value, data,
                rowIndex, etc.)
              </li>
              <li>
                <strong>cellStyle:</strong> Uses CellStyleParams (value, data,
                node, etc.)
              </li>
              <li>
                <strong>cellRenderer:</strong> Uses ICellRendererParams (value,
                data, setValue, etc.)
              </li>
              <li>
                <strong>tooltipValueGetter:</strong> Uses ITooltipParams (value,
                data, etc.)
              </li>
              <li>
                <strong>comparator:</strong> Uses individual values for sorting
              </li>
              <li>
                <strong>🆕 params.api:</strong> Grid API for programmatic
                control (get data, refresh cells, selections)
              </li>
              <li>
                <strong>🆕 params.context:</strong> Custom context data for
                company-wide information
              </li>
            </ul>
          </div>

          {selectedParams && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2">
                Last Clicked Cell Params:
              </h3>
              <div className="text-sm text-green-800 whitespace-pre-wrap">
                {JSON.stringify(selectedParams, null, 2)}
              </div>
            </div>
          )}
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Try These Interactions:
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • <strong>Click any cell</strong> to see its params object above
              </li>
              <li>
                • <strong>Hover over names</strong> to see custom tooltips using
                params.data
              </li>
              <li>
                • <strong>Sort by age/salary</strong> to see dynamic formatting
                change
              </li>
              <li>
                • <strong>Filter by status</strong> to see how params affect
                filtering
              </li>
              <li>
                • <strong>🆕 Click action buttons (📈/ℹ️)</strong> to see
                params.api in action
              </li>
              <li>
                • <strong>🆕 Select multiple rows</strong> then click promote to
                see API usage
              </li>
              <li>
                • <strong>🆕 Hover over Budget Impact</strong> to see
                params.context tooltips
              </li>
              <li>
                • <strong>Notice the styling</strong> - all based on
                params.value and params.data
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Key Params Properties Demonstrated:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  Common Properties:
                </h4>
                <ul className="text-yellow-700 space-y-0.5">
                  <li>
                    • <code>params.value</code> - Current cell value
                  </li>
                  <li>
                    • <code>params.data</code> - Entire row data object
                  </li>
                  <li>
                    • <code>params.node</code> - Row node with metadata
                  </li>
                  <li>
                    • <code>params.column</code> - Column instance
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  Additional Properties:
                </h4>
                <ul className="text-yellow-700 space-y-0.5">
                  <li>
                    • <code>params.colDef</code> - Column definition
                  </li>
                  <li>
                    • <code>params.api</code> - Grid API access
                  </li>
                  <li>
                    • <code>params.rowIndex</code> - Row index
                  </li>
                  <li>
                    • <code>params.context</code> - Custom context
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">
              🚀 Advanced Features Demo:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-800 mb-1">
                  params.api Usage:
                </h4>
                <ul className="text-purple-700 space-y-0.5">
                  <li>
                    • <code>api.getSelectedNodes()</code> - Get selected rows
                  </li>
                  <li>
                    • <code>api.refreshCells()</code> - Refresh specific cells
                  </li>
                  <li>
                    • <code>api.forEachNode()</code> - Iterate all row nodes
                  </li>
                  <li>
                    • <code>api.getDisplayedRowCount()</code> - Get visible row
                    count
                  </li>
                  <li>
                    • <code>node.setData()</code> - Update row data
                    programmatically
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-1">
                  params.context Usage:
                </h4>
                <ul className="text-purple-700 space-y-0.5">
                  <li>• Company-wide configuration data</li>
                  <li>• Department budget information</li>
                  <li>• Fiscal year and currency settings</li>
                  <li>• Performance thresholds</li>
                  <li>• Dynamic calculations based on context</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
