import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

import { devtools } from "zustand/middleware"; // ! for integrating with redux devtools

import initialNodes from "../constants/nodes";
import initialEdges from "../constants/edges";
import { AppState, ColorNode, AppNode } from "../types/types";

function isColorChooserNode(node: AppNode): node is ColorNode {
  return node.type === "colorChooser";
}

/**
 * this is our useStore hook that we can use in our components to get parts of the store and call actions
 * essentially, we are updating nodes, edges global state when user interacts with the nodes graph
 *
 * in our project, we used pipeline class as facade to manage the nodes, edges state
 * -> we are planning to use zustand to manage the state of the nodes and edges
 *
 * better use zustand devtools to inspect the store and see the changes
 * + https://stackoverflow.com/questions/74223036/how-to-use-zustand-devtools-with-typescript
 * + https://github.com/pmndrs/zustand#redux-devtools
 */
const useStore = create<AppState>()(
  devtools((set, get) => ({
    // states:
    nodes: initialNodes,
    edges: initialEdges,

    // actions:
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes) => {
      set({ nodes });
    },
    setEdges: (edges) => {
      set({ edges });
    },
    updateNodeColor: (nodeId, color) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId && isColorChooserNode(node)) {
            // ! it's important to create a new object here, to inform React Flow about the change
            return { ...node, data: { ...node.data, color } };
          }

          return node;
        }),
      });
    },
  })),
);

export default useStore;
