import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";
import { GraphAdapter, NodeInfo, RandomNodeInfo } from "./_lib/graph-adapter";

export const useBuildGraphAsync = () => {
  const reactFlowInstance = useReactFlow();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addNodeAndEdges = useCallback(
    (node: Node, edges: Edge[], delay: number) => {
      return new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          reactFlowInstance.addNodes([node]);
          reactFlowInstance.addEdges(edges);

          resolve();
        }, delay);
      });
    },
    [reactFlowInstance],
  );

  const buildReactFlowGraph = useCallback(
    async (positionedNodes: Node[], graphEdges: Edge[]) => {
      const delay = 500; // Delay between adding each node (in milliseconds)

      // ! TODO: add the nodes and edges one by one with a delay, but this needs to follow a particular order to avoid repetitive edges
      for (const node of positionedNodes) {
        const nodeEdges = graphEdges.filter(
          (edge) => edge.source === node.id || edge.target === node.id,
        );
        await addNodeAndEdges(node, nodeEdges, delay);
        reactFlowInstance.fitView();
      }
    },
    [addNodeAndEdges],
  );

  const buildGraph = useCallback(
    ({ inputGraphInfo }: { inputGraphInfo: RandomNodeInfo[] }) => {
      const graphAdapter = new GraphAdapter();

      const nodeInfoArray = graphAdapter.standardizeGraphInfo(inputGraphInfo);

      const { positionedNodes, graphEdges } =
        graphAdapter.convertToReactFlowGraphData({
          standardizedGraphInfo: nodeInfoArray,
        });

      buildReactFlowGraph(positionedNodes, graphEdges);
    },
    [buildReactFlowGraph],
  );

  const clearGraph = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    reactFlowInstance.setNodes([]);
    reactFlowInstance.setEdges([]);
  }, [reactFlowInstance]);

  return { buildGraph, clearGraph };
};
