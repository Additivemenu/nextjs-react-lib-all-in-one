"use client";

import React from "react";
import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: controlled & uncontrolled",
    path: "/demo1/",
    description: "React controlled and uncontrolled components",
  },
  {
    title: "Demo 2: currency input - custom formatting",
    path: "/demo2/",
    description:
      "custom formatting in controlled component - regex application, text input vs. number input",
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
