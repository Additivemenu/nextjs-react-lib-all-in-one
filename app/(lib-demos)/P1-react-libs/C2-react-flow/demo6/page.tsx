"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type NodeTypes,
  type DefaultEdgeOptions,
} from "@xyflow/react";
import NumberNode from "./nodes/NumberNode";
import TextNode from "./nodes/TextNode";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "node 1", number: 1 },
    position: { x: 5, y: 5 },
    type: "num",
  },
  {
    id: "2",
    data: { label: "a text node", text: "hello" },
    position: { x: 5, y: 100 },
    type: "txt",
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

// ! register your custom node types here!
const nodeTypes: NodeTypes = {
  num: NumberNode,
  txt: TextNode,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

/**
 * https://reactflow.dev/learn/advanced-use/typescript
 *
 * check out type reference for more information https://reactflow.dev/api-reference/types/node
 *
 * ! is this one controlled or uncontrolled?
 *
 * @returns
 */
export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes); // ! need explicit edge type definition
  const [edges, setEdges] = useState<Edge[]>(initialEdges); // ! need explicit edge type definition

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[600px] border border-black">
      <ReactFlow
        // nodes and edges data and types
        nodes={nodes}
        nodeTypes={nodeTypes} // for custom nodes
        edges={edges}
        //   edgeTypes={edgeTypes} // for custom edges
        // event handlers
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        // other configs
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
      />
    </div>
  );
}
