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
          reactFlowInstance.fitView();
          resolve();
        }, delay);
      });
    },
    [reactFlowInstance],
  );

  const buildReactFlowGraph = useCallback(
    async (positionedNodes: Node[], graphEdges: Edge[]) => {
      const delay = 300; // Delay between adding each node (in milliseconds)
      const addedEdgeIds = new Set<string>();

      for (const node of positionedNodes) {
        const nodeEdges = graphEdges.filter(
          (edge) =>
            (edge.source === node.id || edge.target === node.id) &&
            !addedEdgeIds.has(edge.id),
        );

        // Mark these edges as added
        nodeEdges.forEach((edge) => addedEdgeIds.add(edge.id));

        await addNodeAndEdges(node, nodeEdges, delay);
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
