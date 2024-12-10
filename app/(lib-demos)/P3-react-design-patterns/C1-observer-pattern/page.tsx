"use client";

import React from "react";
import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: zustand store subscription",
    path: "/demo1/",
  },
  {
    title: "Demo 2: zustand even driven",
    path: "/demo2/",
    style: "text-purple-500 underline",
  },
];

/**
 * the most important thing about reducer pattern is: Separating the what (the action) from the how (the state update logic)
 *
 * @returns
 */
const Page = () => {
  return (
    <>
      <PageWithAccordions demos={demos} />
    </>
  );
};

export default Page;
