"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const demos = [
  {
    title: "Demo 1: simple react flow",
    path: "/demo1/",
  },
  {
    title: "Demo 2: react flow + Zustand (devtools)",
    path: "/demo2/",
  },
  {
    title: "Demo 3: derive node position info using DFS",
    path: "/demo3/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 3-1: derive node position info using DFS",
    path: "/demo3-1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 4-1: uncontrolled react flow",
    path: "/demo4-1/",
  },
  {
    title: "Demo 4-2: controlled react flow - useReactFlow() hook",
    path: "/demo4-2/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 6: TypeScript usage - useState()",
    path: "/demo6/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 7: custom node - useState() + multiple handles",
    path: "/demo7/",
    style: "text-purple-500 underline",
  },
  {
    title:
      "Demo 8: custom edge - useNodesState(), useEdgesState() + interactive edge label",
    path: "/demo8/",
    style: "text-purple-500 underline",
  },
];

/**
 * a problem with example given in react-flow documentation is that some of the examples are just in js, and some are not working
 *
 * ! for react flow, mainly look at -> https://reactflow.dev/api-reference/react-flow
 * + node, edge
 * + event handlers
 * + hooks
 *
 * ! then look at the examples -> https://reactflow.dev/examples/overview
 *
 */
const Page: React.FC = () => {
  return (
    <>
      <PageWithAccordions demos={demos} />
    </>
  );
};

export default Page;
