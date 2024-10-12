import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useAddNode = (nodeId: number) => {
  const reactFlowInstance = useReactFlow(); // ! for controlling the flow

  const handleAddNewNode = useCallback(() => {
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
  }, []);

  return { handleAddNewNode };
};

export default useAddNode;
