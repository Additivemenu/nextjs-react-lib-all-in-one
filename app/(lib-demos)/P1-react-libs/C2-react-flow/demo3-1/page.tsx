"use client";

import { useCallback, useEffect } from "react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultNodes, initialNodes } from "./_internal/nodes";
import { defaultEdges, initialEdges } from "./_internal/edges";
import useAddNodeAndConnectWithNodeA from "./_hooks/use-add-node-and-connect";
import useAddNodeChain from "./_hooks/use-add-node-chain";
import useAddNode from "./_hooks/use-add-node";
import {
  defaultNodeInfoArray,
  inputNodes,
  useBuildGraph,
} from "./_hooks/use-build-graph";

const edgeOptions = {
  animated: true,
  style: {
    stroke: "white",
  },
};

const connectionLineStyle = { stroke: "white" };

let nodeId = 100;

function Flow() {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  // TODO: make nodeId a state ?
  const { handleAddNodeAndConnect } = useAddNodeAndConnectWithNodeA(nodeId);

  const { buildGraph } = useBuildGraph();

  useEffect(() => {
    buildGraph({ inputGraphInfo: inputNodes });
  }, []);

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
          onClick={handleAddNodeAndConnect}
          className="btn-add px-6 py-3 font-bold text-lg bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          add node and connect it to the first node
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
