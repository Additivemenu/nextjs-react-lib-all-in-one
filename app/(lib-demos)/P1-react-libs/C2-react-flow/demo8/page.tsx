"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from "@xyflow/react";
import CustomEdge from "./custom-edges/CustomEdge";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "Node A" } },
  { id: "b", position: { x: 0, y: 100 }, data: { label: "Node B" } },
];

const initialEdges = [
  { id: "a->b", type: "custom-edge", source: "a", target: "b" },
];

const edgeTypes = {
  "custom-edge": CustomEdge,
};

/**
 * https://reactflow.dev/learn/customization/custom-edges
 *
 * @returns
 */
function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log("connect", connection);

      const edge = { ...connection, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  return (
    <div className="w-full h-[600px] border border-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}

export default Flow;
