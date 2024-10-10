import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useAddNodeChain = (nodeId: number) => {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  const handleAddNodesChain = useCallback(() => {
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

    reactFlowInstance.addNodes(nodes);
    reactFlowInstance.addEdges(edges);
  }, []);

  return { handleAddNodesChain };
};

export default useAddNodeChain;
