import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";

const handleStyle = { left: 10 };

type TextUpdaterNode = Node<{ textContent: string }, "textUpdater">; // <nodeDataType, nodeType>

/**
 * custom node allowing you to
 * 1. embed html element inside a node
 * 2. attach additional information to the node
 *
 * @param param0
 * @returns
 */
function TextUpdaterNode({ data, isConnectable }: NodeProps<TextUpdaterNode>) {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  }, []);

  return (
    <div className="h-16 border border-gray-200 p-1 rounded bg-white">
      {/* TODO: target handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text" className="block text-gray-500 text-xs">
          Text:
        </label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="mt-1 border border-gray-700"
        />
      </div>
      {/* TODO: source handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
