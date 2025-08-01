import React from "react";

interface CustomGridToolbarProps {
  onGetSelectedRows: () => void;
  onClearSelection: () => void;
}

const CustomGridToolbar: React.FC<CustomGridToolbarProps> = ({
  // events bubbles up to the parent component
  onGetSelectedRows,
  onClearSelection,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <h1 style={{ margin: 0, marginBottom: "10px" }}>
        AG Grid Community Features Demo
      </h1>
      <p style={{ margin: 0, color: "#6c757d" }}>
        This demo showcases core AG Grid features like Sorting, Filtering,
        Editing, and Custom Cell Renderers using React and TypeScript.
      </p>
      <div style={{ marginTop: "15px" }}>
        <button onClick={onGetSelectedRows} style={buttonStyle}>
          Get Selected Rows
        </button>
        <button
          onClick={onClearSelection}
          style={{ ...buttonStyle, marginLeft: "10px" }}
        >
          Clear Selection
        </button>
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
