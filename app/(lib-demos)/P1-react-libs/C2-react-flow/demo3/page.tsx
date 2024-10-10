// "use client";

// import React, { useCallback, useEffect } from "react";
// import {
//   ReactFlow,
//   type Node,
//   type Edge,
//   Position,
//   MarkerType,
//   useNodesState,
//   useEdgesState,
// } from "@xyflow/react";

// interface NodeInfo {
//   id: string;
//   name: string;
//   parentIds: string[];
//   childrenIds: string[];
// }

// const HORIZONTAL_SPACING = 200;
// const VERTICAL_SPACING = 100;


// /**
//  * 1 -> 2 -> 4
//  * |    |
//  * |    |-> 5
//  * | 
//  * | -> 3
//  * |
//  * | -> 3
//  * 
//  */
// const defaultNodeInfoArray: NodeInfo[] = [
//   { id: "1", name: "Root", parentIds: [], childrenIds: ["2", "3"] },
//   { id: "2", name: "Child 1", parentIds: ["1"], childrenIds: ["4", "5"] },
//   { id: "3", name: "Child 2", parentIds: ["1"], childrenIds: [] },
//   { id: "4", name: "Grandchild 1", parentIds: ["2"], childrenIds: [] },
//   { id: "5", name: "Grandchild 2", parentIds: ["2"], childrenIds: [] },
// ];

// const GraphBuilder: React.FC<{ nodeInfoArray: NodeInfo[] }> = ({
//   nodeInfoArray = defaultNodeInfoArray,
// }) => {
//   // hooks -------------------------------------------------------------
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);  // ! start with empty nodes and edges
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   // handlers ------------------------------------------------------------
//   const buildGraph = useCallback(() => {
//     const nodeMap = new Map<string, NodeInfo>();
//     const rootNodes: NodeInfo[] = [];

//     // Create a map of all nodes and identify root nodes
//     nodeInfoArray.forEach((node) => {
//       nodeMap.set(node.id, node);
//       if (node.parentIds.length === 0) {
//         rootNodes.push(node);
//       }
//     });

//     const positionedNodes: Node[] = [];  // ! output of DFS -> render nodes
//     const graphEdges: Edge[] = []; // ! output of DFS -> render edges
//     const visitedNodes = new Set<string>();

//     /**
//      * Function to position nodes -> DFS
//      * 
//      * given a node in the graph with position (x, y), position its children recursively
//      * 
//      * @param node 
//      * @param x 
//      * @param y 
//      * @param level 
//      * @returns 
//      */
//     const positionNode = (
//       node: NodeInfo,
//       x: number,
//       y: number,
//       level: number,
//     ) => {
//       if (visitedNodes.has(node.id)) {
//         return; // Prevent cycles
//       }
//       visitedNodes.add(node.id);

//       const newNode: Node = {
//         id: node.id,
//         position: { x, y },
//         data: { label: node.name },
//         sourcePosition: Position.Right,
//         targetPosition: Position.Left,
//       };
//       positionedNodes.push(newNode);

//       // Create edges
//       node.parentIds.forEach((parentId) => {
//         graphEdges.push({
//           id: `${parentId}-${node.id}`,
//           source: parentId,
//           target: node.id,
//           type: "smoothstep",
//           markerEnd: { type: MarkerType.ArrowClosed },
//         });
//       });

//       // Position children
//       const childCount = node.childrenIds.length;
//       const startY = y - ((childCount - 1) * VERTICAL_SPACING) / 2;
//       node.childrenIds.forEach((childId, index) => {
//         const childNode = nodeMap.get(childId);
//         if (childNode) {
//           positionNode(
//             childNode,
//             x + HORIZONTAL_SPACING,
//             startY + index * VERTICAL_SPACING,
//             level + 1,
//           );
//         }
//       });
//     };

//     // Position all root nodes and their descendants -> DFS
//     rootNodes.forEach((rootNode, index) => {
//       positionNode(rootNode, 0, index * VERTICAL_SPACING * 2, 0);
//     });

//     // Handle orphan nodes (nodes with no parents that aren't roots)
//     nodeInfoArray.forEach((node) => {
//       if (!visitedNodes.has(node.id)) {
//         positionNode(node, 0, positionedNodes.length * VERTICAL_SPACING, 0);
//       }
//     });
    
//     setNodes(positionedNodes);
//     setEdges(graphEdges);
//   }, [nodeInfoArray, setNodes, setEdges]);

//   useEffect(() => {
//     buildGraph();
//   }, [buildGraph]);

//   // jsx  ----------------------------------------------------------------
//   return (
//     <div style={{ width: "100%", height: "600px" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         fitView
//       />
//     </div>
//   );
// };

// export default GraphBuilder;
