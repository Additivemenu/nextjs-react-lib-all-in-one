import { Edge, Node } from "@xyflow/react";
import { TreeLayout } from "./layout/TreeLayout";
import { LayoutAlgorithm } from "./layout/LayoutAlgorithm";
import { HierarchicalLayout } from "./layout/HierArchicalLayout";
import { BalancedLayout } from "./layout/BalancedLayout";

// standard graph representation
export interface NodeInfo {
  id: string;
  name: string;
  parentIds: string[];
  childrenIds: string[];
}

// input graph representation (e.g. data returned from backend)
export interface RandomNodeInfo {
  id: string;
  name: string;
  parentIds: string[];
}

export class GraphAdapter {
  private layoutAlgorithm: LayoutAlgorithm;

  // ! strategy pattern for layout algorithms
  constructor(layoutAlgorithm: LayoutAlgorithm = new BalancedLayout()) {
    this.layoutAlgorithm = layoutAlgorithm;
  }

  // allow change layout algorithm at runtime
  public setLayoutAlgorithm(layoutAlgorithm: LayoutAlgorithm) {
    this.layoutAlgorithm = layoutAlgorithm;
  }

  public standardizeGraphInfo(nodes: RandomNodeInfo[]): NodeInfo[] {
    // array -> map
    // Create a map to store nodes by their id for quick access
    const nodeMap = new Map<string, NodeInfo>(
      nodes?.map((node) => [node.id, { ...node, childrenIds: [] }]),
    );

    // Iterate through all nodes to populate childrenIds
    nodeMap.forEach((node) => {
      node.parentIds.forEach((parentId) => {
        const parent = nodeMap.get(parentId);
        if (parent) {
          parent.childrenIds.push(node.id);
        }
      });
    });

    // map -> array
    return Array.from(nodeMap.values());
  }

  /**
   * converts a general graph representation to a ReactFlow graph representation, and add the graph to the flow
   */
  public convertToReactFlowGraphData = ({
    standardizedGraphInfo,
  }: {
    standardizedGraphInfo: NodeInfo[];
  }) => {
    return this.layoutAlgorithm.layout(standardizedGraphInfo);
  };
}
