# AG-Grid Hooks & Params Demo

This demo comprehensively showcases how various AG-Grid hooks use the `params` object to access cell values, row data, column information, and grid context.

## What is the `params` Object?

In AG-Grid column definitions, the `params` argument is a context object that AG-Grid passes to various hook functions. It contains information about the current cell, row, column, and grid state that the function is operating on.

## Demonstrated Hooks & Their Params Types

### 1. `valueFormatter` - ValueFormatterParams

```typescript
valueFormatter: (params: ValueFormatterParams) => {
  // params.value: the raw cell value
  // params.data: the entire row data object
  // params.node: the row node
  // params.colDef: the column definition
  // params.column: the column instance
  // params.api: grid API
  return "$" + params.value.toLocaleString();
};
```

### 2. `cellClass` - CellClassParams

```typescript
cellClass: (params: CellClassParams) => {
  // params.value: current cell value
  // params.data: entire row data
  // params.rowIndex: row index
  // params.node: row node
  // params.column: column instance

  if (params.value > 50000) return "price-high";
  return "price-medium";
};
```

### 3. `cellRenderer` - ICellRendererParams

```typescript
cellRenderer: (params: ICellRendererParams) => {
  // Similar to ValueFormatterParams but with additional rendering context
  // params.setValue: function to update the cell value
  // params.formatValue: function to format the value
  return <CustomComponent value={params.value} data={params.data} />;
};
```

### 4. `tooltipValueGetter` - ITooltipParams

```typescript
tooltipValueGetter: (params: ITooltipParams) => {
  // params.value: cell value
  // params.data: row data
  // params.location: tooltip location context
  return `Tooltip for ${params.value}`;
};
```

### 5. `cellStyle` - CellStyleParams

```typescript
cellStyle: (params) => {
  // Returns CSS style object based on params
  if (params.value < 30) return { backgroundColor: "#e8f5e8" };
  return { backgroundColor: "#f5f5f5" };
};
```

## Key Properties in Params Objects

- **`value`**: The current cell's value
- **`data`**: The entire row data object (e.g., `{name: "John", age: 28, salary: 75000}`)
- **`node`**: The row node containing metadata about the row
- **`column`**: The column instance
- **`colDef`**: The column definition object
- **`api`**: The grid API for programmatic access
- **`context`**: Custom context data passed to the grid
- **`rowIndex`**: The index of the row in the grid

## Demo Features

### Employee Data Grid

The demo displays employee data with the following columns:

1. **Employee Name** - Uses `cellClass` and `tooltipValueGetter`
2. **Age** - Uses `valueFormatter` and `cellStyle`
3. **Salary** - Advanced `valueFormatter` with department context
4. **Department** - Complex `cellClass` with color coding
5. **Start Date** - `valueFormatter` with tenure calculation
6. **Status** - Custom `cellRenderer` component
7. **Performance** - Custom `cellRenderer` with icons and styling
8. **🆕 Actions** - Demonstrates `params.api` usage with interactive buttons
9. **🆕 Budget Impact** - Demonstrates `params.context` usage with company-wide data

### Interactive Features

- **Click any cell** to see its params object displayed
- **Hover over names** to see custom tooltips using params.data
- **Sort columns** to see dynamic formatting changes
- **Filter by status** to see how params affect filtering
- **🆕 Click action buttons (📈/ℹ️)** to see params.api in action
- **🆕 Select multiple rows** then click promote to see API usage
- **🆕 Hover over Budget Impact** to see params.context tooltips
- **Observe styling** - all based on params.value and params.data

## Code Examples from the Demo

### Advanced params.api Usage

```typescript
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
  };

  return (
    <div className="flex gap-1">
      <button onClick={handlePromote}>📈</button>
      <button onClick={handleGetRowInfo}>ℹ️</button>
    </div>
  );
};
```

### Advanced params.context Usage

```typescript
// Define context object with company-wide data
const gridContext = {
  companyName: "TechCorp Inc.",
  fiscalYear: 2025,
  departmentBudgets: {
    Engineering: 2000000,
    Marketing: 1500000,
    HR: 800000,
    Management: 3000000,
  },
};

// Use context in cell renderer
const BudgetAnalysisRenderer = (params: ICellRendererParams) => {
  const { data, context } = params;

  // Access company-wide data from context
  const { departmentBudgets, companyName, fiscalYear } = context;
  const deptBudget = departmentBudgets[data.department] || 0;
  const salaryPercentage = ((data.salary / deptBudget) * 100).toFixed(2);

  return (
    <div>
      <span>{salaryPercentage}%</span>
      <div>{companyName} {fiscalYear}</div>
    </div>
  );
};

// Pass context to grid
<AgGridReact context={gridContext} ... />
```

### Dynamic Salary Formatting

```typescript
valueFormatter: (params: ValueFormatterParams) => {
  // Format as currency
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(params.value);

  // Add department context using params.data
  const dept = params.data.department;
  const avgSalaries = { Engineering: 80000, Marketing: 75000 };
  const avgForDept = avgSalaries[dept] || 70000;
  const indicator = params.value > avgForDept ? " ↑" : " ↓";

  return formatted + indicator;
};
```

### Performance Cell Renderer

```typescript
const PerformanceRenderer = (params: ICellRendererParams) => {
  const { value, data } = params;

  const getPerformanceIcon = () => {
    if (value >= 9) return "⭐";
    if (value >= 8) return "👍";
    return "👌";
  };

  return (
    <div className="flex items-center gap-2">
      <span>{getPerformanceIcon()}</span>
      <span>{value}/10</span>
      <span className="text-xs text-gray-500">({data.department})</span>
    </div>
  );
};
```

### Dynamic Cell Styling

```typescript
cellClass: (params: CellClassParams) => {
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
};
```

## Benefits of Using Params

1. **Context Awareness**: Access to entire row data, not just cell value
2. **Dynamic Behavior**: Make decisions based on multiple data points
3. **Grid Integration**: Access to grid API and column definitions
4. **Flexibility**: Same function signature across different hooks
5. **Performance**: Efficient access to grid state without additional queries
6. **🆕 Programmatic Control**: Use `params.api` for dynamic grid manipulation
7. **🆕 Global State**: Use `params.context` for company-wide data access

## Advanced Params Features

### params.api - Grid API Access

The `params.api` object provides powerful programmatic control over the grid:

- **Data Management**: `api.forEachNode()`, `api.getSelectedNodes()`, `node.setData()`
- **UI Updates**: `api.refreshCells()`, `api.sizeColumnsToFit()`
- **State Access**: `api.getDisplayedRowCount()`, `api.getFilterModel()`
- **Selection Control**: `api.selectAll()`, `api.deselectAll()`

### params.context - Global State Access

The `params.context` object allows sharing application-wide data:

- **Configuration Data**: Company settings, fiscal years, currencies
- **Business Logic**: Department budgets, performance thresholds
- **Calculated Values**: Use context data for dynamic computations
- **Consistent Behavior**: Same context available across all cells

This demo provides a comprehensive understanding of how AG-Grid's params system enables powerful, context-aware grid customization.
