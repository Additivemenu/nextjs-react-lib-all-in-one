import {
  ColDef,
  ValueFormatterParams,
  CellClassParams,
  ITooltipParams,
} from "ag-grid-community";
import { EmployeeData } from "../data/sample-data";
import { GridContext } from "../config/grid-context";
import {
  PerformanceRenderer,
  StatusRenderer,
  ActionButtonRenderer,
  BudgetAnalysisRenderer,
} from "./cell-renderers";

export const createColumnDefs = (): ColDef[] => [
  {
    field: "name",
    headerName: "Employee Name",
    pinned: "left",
    width: 150,
    // cellClass hook - demonstrates CellClassParams
    cellClass: (params: CellClassParams) => {
      // params contains: value, data, node, column, rowIndex, etc.
      const classes = ["font-medium"];

      if (!params.data) return classes.join(" ");

      // Use params.data to access other row data
      if (params.data.isActive) {
        classes.push("text-green-800");
      } else {
        classes.push("text-gray-500");
      }

      // Use params.value for value-specific styling
      if (params.value?.includes("John")) {
        classes.push("bg-blue-50");
      }

      return classes.join(" ");
    },
    // tooltipField can also be a function using ITooltipParams
    tooltipValueGetter: (params: ITooltipParams) => {
      if (!params.data) return "";
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
      if (params.value == null || !params.data) return "";

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
      if (params.value == null || !params.data) return "";

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

      const avgForDept = avgSalaries[dept as keyof typeof avgSalaries] || 70000;
      const indicator = params.value > avgForDept ? " ↑" : " ↓";

      return formatted + indicator;
    },
    cellClass: (params) => {
      // Use both value and contextual data for styling
      const salary = params.value;

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
      if (!params.value) return "";

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
      valueFormatter: (params: any) => (params.value ? "Active" : "Inactive"),
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
      if (!params.context || !params.data) return "N/A";
      const context = params.context as GridContext;
      const { departmentBudgets } = context;
      const deptBudget = departmentBudgets[params.data.department] || 0;
      return ((params.data.salary / deptBudget) * 100).toFixed(2);
    },
    // Sort by budget percentage
    comparator: (valueA: string, valueB: string) =>
      parseFloat(valueA) - parseFloat(valueB),
    // Tooltip showing context usage
    tooltipValueGetter: (params: ITooltipParams) => {
      if (!params.context || !params.data) return "No context available";
      const context = params.context as GridContext;
      const { companyName, fiscalYear, departmentBudgets } = context;
      const deptBudget = departmentBudgets[params.data.department] || 0;
      return `Context Information:
Company: ${companyName}
Fiscal Year: ${fiscalYear}
Department Budget: $${deptBudget.toLocaleString()}
Employee Salary: $${params.data.salary.toLocaleString()}
Budget Impact: ${params.value}%`;
    },
  },
];
