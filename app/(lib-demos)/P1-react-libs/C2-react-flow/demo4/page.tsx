"use client";

import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultNodes } from "./_internal/nodes";
import { defaultEdges } from "./_internal/edges";

const edgeOptions = {
  animated: true,
  style: {
    stroke: "white",
  },
};

const connectionLineStyle = { stroke: "white" };

/**
 * https://reactflow.dev/learn/advanced-use/uncontrolled-flow
 * In an uncontrolled flow the state of the nodes and edges is handled by React Flow internally. 
 * + This is the easiest way to get started with React Flow, but it is also the least flexible one.
 * 
 * 
 * @returns 
 */
export default function UncontrolledFlow() {
  return (
    <div className="w-full h-[600px] border border-black">
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        defaultEdgeOptions={edgeOptions}
        fitView
        style={{
          backgroundColor: "#D3D2E5",
        }}
        connectionLineStyle={connectionLineStyle}
      />
    </div>
  );
}
