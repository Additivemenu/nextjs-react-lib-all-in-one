import React from "react";
import { ICellRendererParams } from "ag-grid-community";

export const ModelRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <strong style={{ fontWeight: "600", color: "#333" }}>{value}</strong>;
};
