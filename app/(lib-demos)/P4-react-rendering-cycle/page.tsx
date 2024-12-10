"use client";
import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const content = [
  {
    title: "demo0: React Strict Mode on useEffect",
    path: "/demo0/",
    style: "text-red-500 underline",
  },
  {
    title: "demo0-1: order of async code execution",
    path: "/demo0-1/",
    style: "text-red-500 underline",
  },

  {
    title: "demo1: ",
    path: "/demo1/",
  },
  {
    title: "demo2: ",
    path: "/demo2/",
    style: "text-red-500 underline",
  },
  {
    title: "demo3: useEffect simple case",
    path: "/demo3/",
  },
  {
    title: "demo4: react-hook-form initial form values",
    path: "/demo4/",
  },
  {
    title: "demo5: useEffect + useMemo + useCallback - sync and async function",
    path: "/demo5/",
    style: "text-purple-500 underline",
  },
  {
    title: "demo5: optimized version on demo5",
    path: "/demo5/",
    style: "text-purple-500 underline",
  },
  {
    title: "demo6: async/await modal open close process",
    path: "/demo6/",
    style: "text-purple-500 underline",
  },
  {
    title: "demo7: diff between useState, useRef, and normal variable",
    path: "/demo7/",
    style: "text-purple-500 underline",
  },
];

export default function Home() {
  return (
    <>
      <PageWithAccordions demos={content} />
    </>
  );
}
