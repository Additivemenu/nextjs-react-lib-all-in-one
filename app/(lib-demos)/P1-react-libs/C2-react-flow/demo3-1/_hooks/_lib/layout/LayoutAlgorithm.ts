import { Edge, Node } from "@xyflow/react";
import { NodeInfo as StandardNodeInfo } from "../graph-adapter";

export interface LayoutAlgorithm {
  layout(nodes: StandardNodeInfo[]): {
    positionedNodes: Node[];
    graphEdges: Edge[];
  };
}
