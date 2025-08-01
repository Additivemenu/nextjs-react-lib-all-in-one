# AG Grid Enhanced Features Demo

This demo showcases advanced AG Grid features and best practices for building data-intensive applications with React and TypeScript.

## ✨ Features Implemented

### 🔍 **Search & Filtering**

- **Quick Filter**: Global search across all columns using the search input
- **Column Filters**: Each column has its own filter with specific configurations:
  - Text filters with case-insensitive matching
  - Number filters with range options
  - Date filters with custom comparators
  - Set filters for boolean values (Electric/Gas)

### 📊 **Data Export**

- **Export All Data**: Export entire dataset to CSV
- **Export Selected**: Export only selected rows to CSV
- Both exports preserve formatting and column headers

### ✏️ **CRUD Operations**

- **Add New Row**: Add new records to the grid
- **Delete Selected**: Remove selected rows with confirmation
- **Inline Editing**: Click any cell to edit values directly
- **Cell Validation**: Price column has min/max validation

### 🎨 **Enhanced UI/UX**

- **Custom Cell Styling**: Different background colors for:
  - Tesla manufacturers (red highlight)
  - Price ranges (green for low, yellow for medium, red for high)
  - Electric vs Gas vehicles
- **Custom Cell Renderers**:
  - Bold model names
  - Electric/Gas icons with text
  - Currency formatting for prices
  - Country flags

### 📱 **Grid Features**

- **Multi-row Selection**: Select multiple rows with checkboxes
- **Column Resizing**: Drag column borders to resize
- **Sorting**: Click headers to sort (Ctrl+click for multi-column sort)
- **Pagination**: Navigate through data with customizable page sizes
- **Row Animations**: Smooth animations when adding/removing rows
- **Range Selection**: Select ranges of cells for copy/paste operations

### 🔧 **Column Management**

- **Auto-size Columns**: Automatically fit columns to content
- **Reset Column Widths**: Reset to default proportional sizing
- **Pinned Columns**: Selection column is pinned to the left
- **Tooltips**: Hover over cells to see full content

## 🏗️ **Technical Implementation**

### Component Structure

```
page.tsx                 # Main component with grid configuration
├── components/
│   └── custom-grid-toolbar.tsx  # Enhanced toolbar with all actions
├── hooks/
│   └── use-colDefs-builder.ts   # Column definitions and configurations
├── styles/
│   └── grid-styles.css          # Custom CSS for enhanced styling
├── cell-renderers/
│   └── country-flag-renderer.tsx # Custom React component for flags
└── row-data.ts                  # Sample data
```

### Key AG Grid Configurations

- **Row Selection**: `{ mode: "multiRow" }`
- **Range Selection**: `enableRangeSelection={true}`
- **Animations**: `animateRows={true}`
- **Multi-sort**: `multiSortKey="ctrl"`
- **Quick Filter**: `quickFilterText` prop

## ColDefs Configuration Details

### toggles

- sortable: Enable/disable column sorting
- editable: Allow inline editing of cell values
- resizable: Allow column width adjustment

### filter types

- agTextColumnFilter: For text-based searching
- agNumberColumnFilter: For numeric range filtering
- agDateColumnFilter: For date range filtering
- agSetColumnFilter: For dropdown/checkbox filtering

### Custom Features

- cellRenderer: Custom React components for rich cell content
- valueFormatter: Format display values (e.g., currency)
- cellClass: Dynamic CSS classes based on cell values
- tooltipField: Show tooltips on hover
- comparator: Custom sorting logic

* filterParams

### cellRenderer

### formatter
