"use client";

import { useCallback } from "react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultNodes } from "./_internal/nodes";
import { defaultEdges } from "./_internal/edges";
import useAddNodeAndConnectWithNodeA from "./_hooks/use-add-node-and-connect";
import useAddNodeChain from "./_hooks/use-add-node-chain";
import useAddNode from "./_hooks/use-add-node";

const edgeOptions = {
  animated: true,
  style: {
    stroke: "white",
  },
};

const connectionLineStyle = { stroke: "white" };

let nodeId = 0;

function Flow() {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  // TODO: make nodeId a state ?

  const { handleAddNewNode } = useAddNode(nodeId);
  const { handleAddNodeAndConnect } = useAddNodeAndConnectWithNodeA(nodeId);
  const { handleAddNodesChain } = useAddNodeChain(nodeId);

  const handleAddNodesChainProgressively = () => {
    const CHAIN_SIZE = 3;

    const nodes = Array.from({ length: CHAIN_SIZE }, (_, i) => {
      const id = `${++nodeId}`;
      return {
        id,
        position: {
          x: Math.random() * 300,
          y: Math.random() * 300,
        },
        data: {
          label: `Node ${id}`,
        },
      };
    });

    const edges = nodes.map((node, i) => {
      if (i === 0) {
        return {
          id: `a->${node.id}`,
          source: "a",
          target: node.id,
        };
      }

      return {
        id: `${nodes[i - 1].id}->${node.id}`,
        source: nodes[i - 1].id,
        target: node.id,
      };
    });

    // instead of adding all nodes and edges at once, we add them one by one
    nodes.forEach((node) => {
      reactFlowInstance.addNodes(node);
      // wait 1 second before adding the next node
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 1000);
    });

    edges.forEach((edge) => {
      reactFlowInstance.addEdges(edge);
      // wait 1 second before adding the next edge
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 1000);
    });
  };

  return (
    <>
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
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleAddNewNode}
          className="btn-add px-6 py-3 font-bold text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          add node
        </button>
        <button
          onClick={handleAddNodeAndConnect}
          className="btn-add px-6 py-3 font-bold text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          add node and connect it to the first node
        </button>
        <button
          onClick={handleAddNodesChain}
          className="btn-add px-6 py-3 font-bold text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          add a node chain to the first node at once
        </button>
        <button
          onClick={handleAddNodesChainProgressively}
          className="btn-add px-6 py-3 font-bold text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          add a node chain progressively
        </button>
      </div>
    </>
  );
}
/**
 * Controlled means, that you are in control of the state of the nodes and edges.
 *
 * but it seems there are a few ways to control the flow
 * 1. useReactFlow hook
 * 2. useNodesState(); -> probably just on top of useState() ? -> demo 8
 * 3. useState -> demo 6, 7
 *
 * ! The Flow component in this example is wrapped with the ReactFlowProvider to use the useReactFlow hook.
 * @returns
 */
export default function ControlledFlow() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
