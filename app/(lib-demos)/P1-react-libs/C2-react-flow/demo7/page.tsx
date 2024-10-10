"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextUpdaterNode from "./custom-nodes/TextUpdaterNode";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

interface CustomNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { value: number };
}

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
  {
    id: "node-2",
    position: { x: 0, y: 200 },
    data: { label: "node 2" },
  },
  {
    id: "node-3",
    position: { x: 200, y: 200 },
    data: { label: "node 3" },
  },
];

const initialEdges = [
  { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: "a" },
  { id: "edge-2", source: "node-1", target: "node-3", sourceHandle: "b" },
];

// ! register your custom node here!
// we define the nodeTypes outside of the component to prevent re-renderings, you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

/**
 * https://reactflow.dev/learn/customization/custom-nodes
 *
 *
 * @returns
 *
 */
function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes); // ! need explicit node type definition
  const [edges, setEdges] = useState<Edge[]>(initialEdges); // ! need explicit edge type definition

  // ! whenever **any** node props change (position, dimension), it will trigger onNodesChange -> so sometimes we need to debounce it
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => {
        console.log("nodes change", changes);
        return applyNodeChanges(changes, nds);
      }),
    [setNodes],
  );
  // trigger of this function?
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        console.log("edges change", changes);
        return applyEdgeChanges(changes, eds);
      }),
    [setEdges],
  );
  // trigger of this function?
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => {
        console.log("connect", connection);
        return addEdge(connection, eds);
      }),
    [setEdges],
  );

  return (
    <div className="w-full h-[600px] border border-black">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes} // for custom nodes
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={rfStyle}
      />
    </div>
  );
}

export default Flow;
