import { Edge } from "@xyflow/react";

/**
 * of course edge can also contain additional information, but here we just keep it simple -> so nothing special to an edge in leetcode terms
 *
 * there are some cases that you need to convert a general graph representation (usually without node position information) to react-flow graph representation
 */
export default [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
] as Edge[];
