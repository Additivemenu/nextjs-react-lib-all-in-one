import { Edge, Node } from "@xyflow/react";
import { NodeInfo } from "../graph-adapter";
import { LayoutAlgorithm } from "./LayoutAlgorithm";

export class BalancedLayout implements LayoutAlgorithm {
  private HORIZONTAL_SPACING = 200;
  private VERTICAL_SPACING = 100;
  private NODE_WIDTH = 150;
  private NODE_HEIGHT = 50;

  layout(nodes: NodeInfo[]): { positionedNodes: Node[]; graphEdges: Edge[] } {
    const { levels, nodeMap } = this.assignLevels(nodes);
    const positionedNodes = this.positionNodes(levels, nodeMap);
    const graphEdges = this.createEdges(nodes);

    return { positionedNodes, graphEdges };
  }

  private assignLevels(nodes: NodeInfo[]): {
    levels: NodeInfo[][];
    nodeMap: Map<string, NodeInfo>;
  } {
    const nodeMap = new Map<string, NodeInfo>();
    const levels: NodeInfo[][] = [];
    const visited = new Set<string>();

    nodes.forEach((node) => nodeMap.set(node.id, node));

    const assignLevel = (node: NodeInfo, level: number) => {
      if (visited.has(node.id)) return;
      visited.add(node.id);

      if (!levels[level]) levels[level] = [];
      levels[level].push(node);

      node.childrenIds.forEach((childId) => {
        const childNode = nodeMap.get(childId);
        if (childNode) assignLevel(childNode, level + 1);
      });
    };

    // Find root nodes and start assigning levels
    nodes
      .filter((node) => node.parentIds.length === 0)
      .forEach((node) => assignLevel(node, 0));

    // Handle any disconnected nodes
    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        const maxLevel = levels.length;
        assignLevel(node, maxLevel);
      }
    });

    return { levels, nodeMap };
  }

  private positionNodes(
    levels: NodeInfo[][],
    nodeMap: Map<string, NodeInfo>,
  ): Node[] {
    const positionedNodes: Node[] = [];
    const nodePositions = new Map<string, { x: number; y: number }>();

    // Position nodes from right to left
    for (let levelIndex = levels.length - 1; levelIndex >= 0; levelIndex--) {
      const level = levels[levelIndex];
      const x = levelIndex * (this.NODE_WIDTH + this.HORIZONTAL_SPACING);

      level.forEach((node) => {
        let y: number;

        if (node.childrenIds.length > 0) {
          // Position parent at the average y of its children
          const childrenYs = node.childrenIds
            .map((childId) => nodePositions.get(childId)?.y)
            .filter((y): y is number => y !== undefined);
          y = childrenYs.reduce((sum, y) => sum + y, 0) / childrenYs.length;
        } else {
          // For leaf nodes, just stack them vertically
          const prevNodeY = level[level.indexOf(node) - 1];
          y = prevNodeY
            ? nodePositions.get(prevNodeY.id)!.y + this.VERTICAL_SPACING
            : 0;
        }

        nodePositions.set(node.id, { x, y });
      });
    }

    // Create the final positioned nodes
    nodePositions.forEach((position, id) => {
      const node = nodeMap.get(id)!;
      positionedNodes.push({
        id: node.id,
        position: position,
        data: { label: `${node.id}:${node.name}` },
      });
    });

    return this.adjustOverlaps(positionedNodes);
  }

  private createEdges(nodes: NodeInfo[]): Edge[] {
    return nodes.flatMap((node) =>
      node.parentIds.map((parentId) => ({
        id: `e${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
      })),
    );
  }

  private adjustOverlaps(nodes: Node[]): Node[] {
    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x);

    for (let i = 0; i < sortedNodes.length; i++) {
      const currentNode = sortedNodes[i];
      const sameColumnNodes = sortedNodes.filter(
        (n) =>
          n.position.x === currentNode.position.x && n.id !== currentNode.id,
      );

      sameColumnNodes.forEach((otherNode) => {
        const verticalDistance = Math.abs(
          currentNode.position.y - otherNode.position.y,
        );
        if (verticalDistance < this.VERTICAL_SPACING) {
          const adjustment = (this.VERTICAL_SPACING - verticalDistance) / 2;
          if (currentNode.position.y < otherNode.position.y) {
            currentNode.position.y -= adjustment;
            otherNode.position.y += adjustment;
          } else {
            currentNode.position.y += adjustment;
            otherNode.position.y -= adjustment;
          }
        }
      });
    }

    return sortedNodes;
  }
}
