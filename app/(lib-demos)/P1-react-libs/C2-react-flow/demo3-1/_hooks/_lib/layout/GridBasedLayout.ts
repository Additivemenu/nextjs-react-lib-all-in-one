import { Edge, Node, Position } from "@xyflow/react";
import { LayoutAlgorithm } from "./LayoutAlgorithm";

interface NodeInfo {
  id: string;
  name: string;
  parentIds: string[];
  childrenIds: string[];
}

// interface PositionedNode extends Node {
//   data: { label: string };
// }

interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
}

export class GridBasedLayout implements LayoutAlgorithm {
  private CELL_WIDTH = 200;
  private CELL_HEIGHT = 100;
  private grid: GridCell[][] = [];
  private maxColumns = 0;

  layout(nodes: NodeInfo[]): {
    positionedNodes: Node[];
    graphEdges: Edge[];
  } {
    const { levels, nodeMap } = this.assignLevels(nodes);
    this.initializeGrid(levels);
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

  private initializeGrid(levels: NodeInfo[][]) {
    this.maxColumns = levels.length;
    const maxRows = Math.max(...levels.map((level) => level.length));

    this.grid = Array(maxRows)
      .fill(null)
      .map(() =>
        Array(this.maxColumns)
          .fill(null)
          .map((_, x) => ({ x, y: 0, occupied: false })),
      );
  }

  private findAvailableCell(column: number): GridCell | null {
    for (let row = 0; row < this.grid.length; row++) {
      if (!this.grid[row][column].occupied) {
        return this.grid[row][column];
      }
    }
    return null;
  }

  private positionNodes(
    levels: NodeInfo[][],
    nodeMap: Map<string, NodeInfo>,
  ): Node[] {
    const positionedNodes: Node[] = [];

    levels.forEach((level, levelIndex) => {
      level.forEach((node) => {
        const cell = this.findAvailableCell(levelIndex);
        if (cell) {
          cell.occupied = true;
          const position = {
            x: cell.x * this.CELL_WIDTH,
            y: cell.y * this.CELL_HEIGHT,
          };
          positionedNodes.push({
            id: node.id,
            position,
            data: { label: `${node.id}:${node.name}` },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });
        }
      });
    });

    return positionedNodes;
  }

  private createEdges(nodes: NodeInfo[]): Edge[] {
    return nodes.flatMap((node) =>
      node.childrenIds.map((childId) => ({
        id: `e${node.id}-${childId}`,
        source: node.id,
        target: childId,
        type: "smoothstep",
      })),
    );
  }
}
