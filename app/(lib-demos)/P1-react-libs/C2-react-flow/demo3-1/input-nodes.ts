/**
 * having both parentIds and childrenIds is redundant, but it makes traversal easier
 *
 * 1 -> 2 -> 4
 * |    |
 * |    |-> 5
 * |
 * | -> 3
 * |
 *
 */
// export const defaultNodeInfoArray: NodeInfo[] = [
//   { id: "1", name: "Root", parentIds: [], childrenIds: ["2", "3"] },
//   { id: "2", name: "Child 1", parentIds: ["1"], childrenIds: ["4", "5"] },
//   { id: "6", name: "Grandchild 3", parentIds: ["4"], childrenIds: [] },
//   { id: "3", name: "Child 2", parentIds: ["1"], childrenIds: [] },
//   { id: "4", name: "Grandchild 1", parentIds: ["2"], childrenIds: ["6"] },
//   { id: "5", name: "Grandchild 2", parentIds: ["2"], childrenIds: [] },
// ];

import { RandomNodeInfo } from "./_hooks/_lib/graph-adapter";

// simulate data returned from backend
// with the order that differs from we render the nodes
// export const inputNodes: RandomNodeInfo[] = [
//   { id: "3", name: "Child 2", parentIds: ["1"] },
//   { id: "2", name: "Child 1", parentIds: ["1"] },
//   { id: "5", name: "Grandchild 2", parentIds: ["2"] },
//   { id: "1", name: "Root", parentIds: [] },
//   { id: "4", name: "Grandchild 1", parentIds: ["2"] },
//   { id: "8", name: "Grandchild 6", parentIds: ["2"] },
//   { id: "7", name: "Grandchild 5", parentIds: ["2"] },
//   { id: "9", name: "Grandchild 7", parentIds: ["3"] },
//   { id: "6", name: "Grandchild 3", parentIds: ["4"] },
//   { id: "10", name: "Grandchild 8", parentIds: ["3"] },
// ];

// with order the same as we render the nodes
export const inputNodes: RandomNodeInfo[] = [
  { id: "1", name: "Root", parentIds: [] },
  { id: "3", name: "Child 2", parentIds: ["1"] },
  { id: "2", name: "Child 1", parentIds: ["1"] },
  { id: "4", name: "Grandchild 1", parentIds: ["2"] },
  { id: "5", name: "Grandchild 2", parentIds: ["2"] },
  { id: "6", name: "Grandchild 3", parentIds: ["4"] },
  { id: "7", name: "Grandchild 5", parentIds: ["2"] },
  { id: "8", name: "Grandchild 6", parentIds: ["2"] },
  { id: "9", name: "Grandchild 7", parentIds: ["3"] },
  { id: "10", name: "Grandchild 8", parentIds: ["3"] },
];
