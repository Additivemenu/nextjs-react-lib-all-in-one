import type { Node, NodeProps } from "@xyflow/react";

type NumberNode = Node<{ number: number }, "number">;  // <nodeDataType, nodeType>

export default function NumberNode({ data }: NodeProps<NumberNode>) {
  return (
    <div className="w-32 h-16 border border-red-500">A special number: {data.number}</div>
  );
}
