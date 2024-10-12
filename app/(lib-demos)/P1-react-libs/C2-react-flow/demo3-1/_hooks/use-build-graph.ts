import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { GraphAdapter, NodeInfo, RandomNodeInfo } from "./_lib/graph-adapter";

/**
 * having both parentIds and childrenIds is redundant, but it makes traversal easier
 *
 * 1 -> 2 -> 4
 * |    |
 * |    |-> 5
 * |
 * | -> 3
 * |
 *
 */
export const defaultNodeInfoArray: NodeInfo[] = [
  { id: "1", name: "Root", parentIds: [], childrenIds: ["2", "3"] },
  { id: "2", name: "Child 1", parentIds: ["1"], childrenIds: ["4", "5"] },
  { id: "6", name: "Grandchild 3", parentIds: ["4"], childrenIds: [] },
  { id: "3", name: "Child 2", parentIds: ["1"], childrenIds: [] },
  { id: "4", name: "Grandchild 1", parentIds: ["2"], childrenIds: ["6"] },
  { id: "5", name: "Grandchild 2", parentIds: ["2"], childrenIds: [] },
];

// simulate data returned from backend
// interface RandomNodeInfo {
//   id: string;
//   name: string;
//   parentIds: string[];
// }
export const inputNodes: RandomNodeInfo[] = [
  { id: "1", name: "Root", parentIds: [] },
  { id: "2", name: "Child 1", parentIds: ["1"] },
  { id: "3", name: "Child 2", parentIds: ["1"] },
  { id: "4", name: "Grandchild 1", parentIds: ["2"] },
  { id: "5", name: "Grandchild 2", parentIds: ["2"] },
  { id: "6", name: "Grandchild 3", parentIds: ["4"] },
  { id: "7", name: "Grandchild 4", parentIds: ["3"] },
  { id: "8", name: "Grandchild 4", parentIds: ["2"] },
  { id: "9", name: "Grandchild 4", parentIds: ["3"] },
  { id: "10", name: "Grandchild 4", parentIds: ["2"] },
];

/**
 * hooks used for building a graph in ReactFlow from a general graph representation data
 * @returns
 */
export const useBuildGraph = () => {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  const buildReactFlowGraph = useCallback(
    (positionedNodes: Node[], graphEdges: Edge[]) => {
      console.log("positionedNodes", positionedNodes);
      console.log("graphEdges", graphEdges);

      reactFlowInstance?.addNodes(positionedNodes);
      reactFlowInstance?.addEdges(graphEdges);
    },
    [],
  );

  const buildGraph = useCallback(
    ({ inputGraphInfo }: { inputGraphInfo: RandomNodeInfo[] }) => {
      const graphAdapter = new GraphAdapter();

      // step1:
      const nodeInfoArray = graphAdapter.standardizeGraphInfo(inputGraphInfo);

      // step2:
      const { positionedNodes, graphEdges } =
        graphAdapter.convertToReactFlowGraphData({
          nodeInfoArray,
        });

      // step3:
      buildReactFlowGraph(positionedNodes, graphEdges);
    },
    [buildReactFlowGraph],
  );

  return { buildGraph };
};
