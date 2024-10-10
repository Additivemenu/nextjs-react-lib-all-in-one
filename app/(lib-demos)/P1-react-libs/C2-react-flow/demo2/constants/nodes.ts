import { AppNode } from "../types/types";

/**
 * ! there are some cases that you need to convert a general graph representation (usually without node position information) to react-flow graph representation
 *
 * in react-flow graph representation
 * + each node has a unique id, position information and data property (which can be used to store additional information)
 * + the connection between nodes is represented by edges
 *
 */
export default [
  {
    id: "1",
    type: "colorChooser",
    data: { color: "#4FD1C5" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    type: "colorChooser",
    data: { color: "#F6E05E" },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "colorChooser",
    data: { color: "#B794F4" },
    position: { x: 250, y: 250 },
  },
] as AppNode[];
