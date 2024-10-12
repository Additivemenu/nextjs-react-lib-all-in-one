import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useAddNodeAndConnectWithNodeA = (nodeId: number) => {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  const handleAddNodeAndConnect = useCallback(() => {
    const id = `${++nodeId}`;
    const newNode = {
      id,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {
        label: `Node ${id}`,
      },
    };
    reactFlowInstance.addNodes(newNode);

    const edge = {
      id: `e1->${id}`,
      source: "a",
      target: id,
    };
    reactFlowInstance.addEdges([edge]);
  }, []);

  return { handleAddNodeAndConnect };
};

export default useAddNodeAndConnectWithNodeA;
