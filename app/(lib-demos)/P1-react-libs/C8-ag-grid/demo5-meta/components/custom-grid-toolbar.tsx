import React from "react";

interface CustomGridToolbarProps {
  onGetSelectedRows: () => void;
  onClearSelection: () => void;
  onExportCSV: () => void;
  onExportSelectedCSV: () => void;
  onAddRow: () => void;
  onDeleteSelected: () => void;
  onAutoSizeColumns: () => void;
  onResetColumns: () => void;
  quickFilterText: string;
  onQuickFilterChange: (text: string) => void;
}

const CustomGridToolbar: React.FC<CustomGridToolbarProps> = ({
  // events bubbles up to the parent component
  onGetSelectedRows,
  onClearSelection,
  onExportCSV,
  onExportSelectedCSV,
  onAddRow,
  onDeleteSelected,
  onAutoSizeColumns,
  onResetColumns,
  quickFilterText,
  onQuickFilterChange,
}) => {
  return (
    <div className="custom-grid-toolbar">
      <h1 style={{ margin: 0, marginBottom: "10px" }}>
        AG Grid Enhanced Features Demo
      </h1>
      <p style={{ margin: 0, marginBottom: "15px" }}>
        This demo showcases advanced AG Grid features including export, search,
        CRUD operations, and interactive features.
      </p>

      {/* Search Section */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Quick filter across all columns..."
          value={quickFilterText}
          onChange={(e) => onQuickFilterChange(e.target.value)}
          className="quick-filter-input"
          style={{ width: "300px" }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {/* Selection Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onGetSelectedRows} className="toolbar-button">
            📊 Get Selected Rows
          </button>
          <button onClick={onClearSelection} className="toolbar-button">
            🧹 Clear Selection
          </button>
        </div>

        {/* Export Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onExportCSV} className="toolbar-button">
            💾 Export All to CSV
          </button>
          <button onClick={onExportSelectedCSV} className="toolbar-button">
            📋 Export Selected to CSV
          </button>
        </div>

        {/* CRUD Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onAddRow} className="toolbar-button">
            ➕ Add New Row
          </button>
          <button onClick={onDeleteSelected} className="toolbar-button">
            🗑️ Delete Selected
          </button>
        </div>

        {/* Column Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onAutoSizeColumns} className="toolbar-button">
            📏 Auto-size Columns
          </button>
          <button onClick={onResetColumns} className="toolbar-button">
            🔄 Reset Column Width
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple styling for buttons
const buttonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
};

export default CustomGridToolbar;
