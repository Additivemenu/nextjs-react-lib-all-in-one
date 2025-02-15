"use client";

import React from "react";
import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: task manager (useReducer, not using react-hook-form)",
    path: "/demo1/",
  },
  {
    title: "TODO: Demo 1-1: task manager (zustand + react-hook-form)",
    path: "/demo1-1/",
    style: "text-purple-500 underline",
  },
  {
    title:
      "🛡️ Demo 2: task manager (useReducer with react-hook-form + zod + file break down)",
    path: "/demo2/",
    style: "text-purple-500 underline",
    description: "need to refine aria-label and how to query input in jest test",
  },
  {
    title:
      "🛡️ Demo 2-1: task manager (zustand with react-hook-form + zod + file break down)",
    path: "/demo2-1/",
    style: "text-purple-500 underline",
    description: "Unit tests are mostly needed for form interaction!!!",
  },
  {
    title: "Demo 3: todo list - just normal todo list with zustand",
    path: "/demo3/",
    style: "text-purple-500 underline",
    description: "just normal todo list with zustand",
  },
  {
    title: "Demo 3-1: todo list - with sequence actions",
    path: "/demo3-1/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 3-2: todo list - with sequence actions",
    path: "/demo3-2/",
    style: "text-red-500 underline",
  },
];

/**
 * the most important thing about reducer pattern is: Separating the what (the action) from the how (the state update logic)
 *
 * @returns
 */
const Page = () => {
  return <PageWithAccordions demos={demos} />;
};

export default Page;
