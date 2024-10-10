import {
  getStraightPath,
  BaseEdge,
  type EdgeProps,
  type Edge,
  useReactFlow,
  EdgeLabelRenderer,
} from "@xyflow/react";

type CustomEdge = Edge<{ value: number }, "custom">;

/**
 * https://reactflow.dev/learn/advanced-use/typescript#custom-edges
 *
 * @param param0
 * @returns
 */
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<CustomEdge>) {
  const { setEdges } = useReactFlow(); // controlled flow

  // the default edge in react-flow is not a straight line, but a curve
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />;
      <EdgeLabelRenderer>
        <button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all", // ! This will ensure that the label is clickable.
          }}
          className="nodrag nopan border border-slate-500 bg-slate-300" // ! This stops mouse events from controlling the canvas.
          onClick={() => {
            setEdges((edges) => {
              return edges.filter((e) => e.id !== id);
            });
          }}
        >
          delete
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
