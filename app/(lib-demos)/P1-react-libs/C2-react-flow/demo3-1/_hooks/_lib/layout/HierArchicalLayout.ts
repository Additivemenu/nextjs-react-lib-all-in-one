import { Edge, Node } from "@xyflow/react";
import { NodeInfo } from "../graph-adapter";
import { LayoutAlgorithm } from "./LayoutAlgorithm";

export class HierarchicalLayout implements LayoutAlgorithm {
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

    levels.forEach((level, levelIndex) => {
      const levelHeight =
        level.length * (this.NODE_HEIGHT + this.VERTICAL_SPACING);
      let currentY = -levelHeight / 2;

      level.forEach((node) => {
        const x = levelIndex * (this.NODE_WIDTH + this.HORIZONTAL_SPACING);
        const y = currentY + this.NODE_HEIGHT / 2;

        positionedNodes.push({
          id: node.id,
          position: { x, y },
          data: { label: node.name },
        });

        currentY += this.NODE_HEIGHT + this.VERTICAL_SPACING;
      });
    });

    // Apply forces to reduce overlaps
    return this.reduceOverlaps(positionedNodes);
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

  private reduceOverlaps(nodes: Node[]): Node[] {
    const ITERATIONS = 10;
    const FORCE = 1;

    for (let i = 0; i < ITERATIONS; i++) {
      nodes.forEach((node, index) => {
        let fy = 0;
        nodes.forEach((otherNode, otherIndex) => {
          if (
            index !== otherIndex &&
            Math.abs(node.position.x - otherNode.position.x) < this.NODE_WIDTH
          ) {
            const dy = node.position.y - otherNode.position.y;
            const absdy = Math.abs(dy);
            if (absdy < this.NODE_HEIGHT) {
              fy += dy > 0 ? FORCE : -FORCE;
            }
          }
        });
        node.position.y += fy;
      });
    }

    return nodes;
  }
}
