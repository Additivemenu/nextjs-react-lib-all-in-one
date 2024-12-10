"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const demos = [
  {
    title: "Demo 1: useEffect vs. subscribe",
    path: "/demo1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 2: todo modal - normal case",
    path: "/demo2/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 3: todo modal (programmatically)",
    path: "/demo3/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 4: todo app - optics",
    path: "/demo4/",
    style: "text-red-500 underline",
  },
];

/**
 *
 *
 *
 */
const Page: React.FC = () => {
  return <PageWithAccordions demos={demos} />;
};

export default Page;
