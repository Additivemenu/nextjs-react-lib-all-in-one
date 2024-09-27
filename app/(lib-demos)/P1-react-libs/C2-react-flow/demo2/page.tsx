"use client";
import React from "react";

import { useShallow } from "zustand/react/shallow";
import { ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import useStore from "./stores/store";
import ColorChooserNode from "./components/ColorChooserNode";

const nodeTypes = { colorChooser: ColorChooserNode };

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

/**
 *  a very simple but classic way to use zustand with react flow
 *  https://reactflow.dev/learn/advanced-use/state-management
 *
 */
const Page: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  return (
    <div className="flex items-center justify-center">
      <div className="w-[1200px] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          React Flow + Zustand
        </h1>

        <div className="w-full h-[600px] border border-black">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
