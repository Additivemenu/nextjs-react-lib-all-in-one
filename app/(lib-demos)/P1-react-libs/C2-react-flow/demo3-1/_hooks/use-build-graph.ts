import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { GraphAdapter, RandomNodeInfo } from "./_lib/graph-adapter";

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
          standardizedGraphInfo: nodeInfoArray,
        });

      // step3:
      // this is build all at once
      buildReactFlowGraph(positionedNodes, graphEdges);
      // TODO: try to add nodes and edges one by one
    },
    [buildReactFlowGraph],
  );

  return { buildGraph };
};
