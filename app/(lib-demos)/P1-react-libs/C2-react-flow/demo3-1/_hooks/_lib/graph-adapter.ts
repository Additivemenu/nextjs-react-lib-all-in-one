import { Edge, Node } from "@xyflow/react";

export interface NodeInfo {
  id: string;
  name: string;
  parentIds: string[];
  childrenIds: string[];
}

export interface RandomNodeInfo {
  id: string;
  name: string;
  parentIds: string[];
}

export class GraphAdapter {
  private HORIZONTAL_SPACING;
  private VERTICAL_SPACING;

  constructor(horizontalSpacing = 200, verticalSpacing = 100) {
    this.HORIZONTAL_SPACING = horizontalSpacing;
    this.VERTICAL_SPACING = verticalSpacing;
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
   *
   * FIXME: the generated graph may have the problem of overlapping nodes
   *
   */
  public convertToReactFlowGraphData = ({
    nodeInfoArray,
  }: {
    nodeInfoArray: NodeInfo[];
  }) => {
    // step1: convert any general graph representation to our standard graph representation =================================

    // step2: convert our standard graph representation to ReactFlow graph representation  =================================
    const nodeMap = new Map<string, NodeInfo>();
    const rootNodes: NodeInfo[] = [];
    // Create a map of all nodes and identify root nodes
    nodeInfoArray.forEach((node) => {
      nodeMap.set(node.id, node);
      if (node.parentIds.length === 0) {
        rootNodes.push(node);
      }
    });
    const positionedNodes: Node[] = []; // ! output of DFS -> render nodes
    const graphEdges: Edge[] = []; // ! output of DFS -> render edges
    const visitedNodes = new Set<string>();
    /**
     * Function to position nodes -> DFS
     *
     * given a node in the graph with position (x, y), position its children recursively
     *
     * @param node
     * @param x
     * @param y
     * @param level
     * @returns
     */
    const positionNode = (
      node: NodeInfo,
      x: number,
      y: number,
      level: number,
    ) => {
      if (visitedNodes.has(node.id)) {
        return; // Prevent cycles
      }
      visitedNodes.add(node.id);
      // do something with the current node --------------------------------
      const newNode: Node = {
        id: node.id,
        position: { x, y },
        data: { label: `${node.id}: ${node.name}` },
        // sourcePosition: Position.Right,
        // targetPosition: Position.Left,
      };
      positionedNodes.push(newNode);
      // Create edges
      node.parentIds.forEach((parentId) => {
        graphEdges.push({
          id: `e${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          //   type: "smoothstep",
          //   markerEnd: { type: MarkerType.ArrowClosed },
        });
      });
      // Position children -> go deeper ------------------------------------
      const childCount = node.childrenIds.length;
      const startY = y - ((childCount - 1) * this.VERTICAL_SPACING) / 2;
      node.childrenIds.forEach((childId, index) => {
        const childNode = nodeMap.get(childId);
        if (childNode) {
          positionNode(
            childNode,
            x + this.HORIZONTAL_SPACING,
            startY + index * this.VERTICAL_SPACING,
            level + 1,
          );
        }
      });
    };
    // debugger;
    // Position all root nodes and their descendants -> DFS
    // ! this is the entry point of the DFS
    rootNodes.forEach((rootNode, index) => {
      positionNode(rootNode, 0, index * this.VERTICAL_SPACING * 2, 0);
    });
    // Handle orphan nodes (nodes with no parents that aren't roots)
    nodeInfoArray.forEach((node) => {
      if (!visitedNodes.has(node.id)) {
        positionNode(
          node,
          0,
          positionedNodes.length * this.VERTICAL_SPACING,
          0,
        );
      }
    });

    return { positionedNodes, graphEdges };
  };
}
