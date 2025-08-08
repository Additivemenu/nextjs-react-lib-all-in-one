https://www.ag-grid.com/react-data-grid/getting-started/

# key features

ag-grid 已经封装好了很多功能, 用起来主打 configuration (not composition), 同时允许插入一定程度的自定义的逻辑 (e.g. cell component, custom filter, custom cell editor)

## Showing Data

define how to display data in a configuration object (usually column-wise)

- mapping values -> `valueGetter`
- format values -> `valueFormatter`
- cell component
  - render a custom component in a cell
- resizing column

## Working with data

- filtering
  - ag-grid has 5 provided filters, you can also have custom filter
- editing
  - 7 provided cell editor, you can also create your own custom cell editor
- sorting
- row selection
  - `rowSelection` attr obj on table component
- pagination
  - `pagination` attr on table component

## Theme & Styling

- `theme` attr on table component allows you to define custom theme for the table
  - ag-grid provides a theme builder interface
- cell style
  - `cellClassRules` + css --> conditional cell styling
- row style
  - `rowClassRules` + css --> conditional cell styling

## Key AG-Grid Concepts (Summary from Demo5 & Demo6)

### 1. **Configuration-Based Architecture**

AG-Grid follows a configuration-over-composition pattern where most functionality is controlled through configuration objects:

- **`colDefs`**: Array defining columns, their behavior, and appearance
- **`defaultColDef`**: Default properties applied to all columns (can be overridden)
- **`gridOptions`**: Global grid configuration for themes, pagination, selection, etc.

### 2. **The `params` Object - Core Communication Pattern**

The `params` object is AG-Grid's primary way to pass context and data to various hooks and functions. Different types of params provide different capabilities:

#### **ICellRendererParams** (Cell Renderers)

```typescript
// Basic params usage
const { value, data, node, api, context } = params;
- value: Current cell value
- data: Complete row data object
- node: Grid node with metadata
- api: Grid API for programmatic control
- context: Custom business context
```

#### **ValueFormatterParams** (Data Formatting)

```typescript
// Format cell values with access to row context
valueFormatter: (params) => {
  const salary = params.value;
  const dept = params.data.department;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(salary);
};
```

#### **CellClassParams** (Dynamic Styling)

```typescript
// Conditional CSS classes based on data
cellClass: (params) => {
  if (params.value > 100000) return "high-salary";
  return "normal-salary";
};
```

### 3. **Grid API - Programmatic Control**

The Grid API (`params.api`) provides powerful programmatic access:

- **Selection**: `getSelectedNodes()`, `selectAll()`, `deselectAll()`
- **Data Manipulation**: `refreshCells()`, `updateRowData()`, `setRowData()`
- **Grid Information**: `getDisplayedRowCount()`, `forEachNode()`
- **Layout**: `sizeColumnsToFit()`, `autoSizeAllColumns()`

### 4. **Custom Cell Renderers**

Cell renderers replace default cell display with custom React components:

```typescript
// Simple renderer
const StatusRenderer = (params: ICellRendererParams) => {
  const isActive = params.value;
  return (
    <span className={isActive ? "text-green-600" : "text-red-600"}>
      {isActive ? "✅ Active" : "❌ Inactive"}
    </span>
  );
};
```

### 5. **Context System**

Context provides shared business data/configuration across all grid functions:

```typescript
// Grid context setup
const gridContext = {
  companyName: "TechCorp",
  fiscalYear: 2024,
  departmentBudgets: { Engineering: 1000000, HR: 500000 },
};

// Usage in any grid function
cellRenderer: (params) => {
  const { departmentBudgets } = params.context;
  // Use context data for business logic
};
```

### 6. **Advanced Column Features**

#### **Value Getters & Formatters**

```typescript
{
  field: "salary",
  valueFormatter: (params) => `$${params.value.toLocaleString()}`,
  valueGetter: (params) => params.data.baseSalary + params.data.bonus
}
```

#### **Conditional Styling**

```typescript
{
  field: "performance",
  cellStyle: (params) => {
    if (params.value >= 8) return { backgroundColor: '#d4edda' };
    if (params.value <= 5) return { backgroundColor: '#f8d7da' };
    return null;
  }
}
```

#### **Custom Comparators**

```typescript
{
  field: "priority",
  comparator: (valueA, valueB) => {
    const priorities = { High: 3, Medium: 2, Low: 1 };
    return priorities[valueA] - priorities[valueB];
  }
}
```

### 7. **Event Handling**

AG-Grid provides comprehensive event system:

- **Grid Events**: `onGridReady`, `onFirstDataRendered`
- **Cell Events**: `onCellClicked`, `onCellValueChanged`
- **Selection Events**: `onSelectionChanged`, `onRowSelected`

### 8. **Module System**

AG-Grid uses modular architecture for tree-shaking:

```typescript
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
```

### 9. **React Integration Patterns**

#### **Custom Hooks for Grid Configuration**

```typescript
const useGridConfiguration = () => {
  const [rowData, setRowData] = useState(initialData);
  const colDefs = useMemo(() => createColumnDefs(), []);
  const defaultColDef = useMemo(() => ({ sortable: true, filter: true }), []);

  return { rowData, colDefs, defaultColDef };
};
```

#### **Grid Reference for API Access**

```typescript
const gridRef = useRef<AgGridReact>(null);
const handleExport = () => {
  gridRef.current?.api.exportDataAsCsv();
};
```

### 10. **Performance Optimization**

- **Virtualization**: Built-in row and column virtualization for large datasets
- **Memoization**: Use `useMemo` for column definitions and static configurations
- **Callback Optimization**: Use `useCallback` for event handlers
- **Conditional Rendering**: Only render cell renderers when necessary

### 11. **Advanced Features Demonstrated**

- **Row Selection**: Checkbox selection with header selection
- **Column Pinning**: Pin important columns to left/right
- **Tooltips**: Rich tooltips with context information
- **Filtering**: Text, number, date, and custom filters
- **Sorting**: Single and multi-column sorting with custom comparators
- **Theming**: CSS customization and responsive design

This configuration-driven approach makes AG-Grid extremely powerful while maintaining clean, declarative code that's easy to maintain and extend.
