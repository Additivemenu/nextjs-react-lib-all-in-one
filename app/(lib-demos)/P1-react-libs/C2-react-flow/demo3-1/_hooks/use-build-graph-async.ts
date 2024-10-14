import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";
import { GraphAdapter, NodeInfo, RandomNodeInfo } from "./_lib/graph-adapter";
import { GridBasedLayout } from "./_lib/layout/GridBasedLayout";

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
      const addedEdgeIds = new Set<string>();  // Track added edges to avoid duplicates

      for (const node of positionedNodes) {
        // find the edge that connects to the current node
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

      // step1: standardize graph info
      const nodeInfoArray = graphAdapter.standardizeGraphInfo(inputGraphInfo);

      // step2: convert to ReactFlow graph data
      const { positionedNodes, graphEdges } =
        graphAdapter.convertToReactFlowGraphData({
          standardizedGraphInfo: nodeInfoArray,
        });
      // ! is positionedNodes containing order information?  -> seems no, the nodes order in the input graph will affect the order in the output graph
      console.log("positionedNodes", positionedNodes);
      console.log("graphEdges", graphEdges);

      // step3: build graph progressively
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
