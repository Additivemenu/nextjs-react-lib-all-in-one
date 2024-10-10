import type { Node, NodeProps } from "@xyflow/react";

type TextNode = Node<{ text: string }, "text">;

export default function TextNode({ data }: NodeProps<TextNode>) {
  return <div className="w-32 h-16 border border-blue-500">A special Text: {data.text}</div>;
}
