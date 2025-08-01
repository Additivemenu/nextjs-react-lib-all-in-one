import React from "react";
import { ICellRendererParams } from "ag-grid-community";

export const ElectricVehicleRenderer: React.FC<ICellRendererParams> = ({
  value,
}) => {
  const isElectric = value;
  const icon = isElectric ? "⚡" : "⛽";
  const text = isElectric ? "Electric" : "Gas";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        height: "100%",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
};
