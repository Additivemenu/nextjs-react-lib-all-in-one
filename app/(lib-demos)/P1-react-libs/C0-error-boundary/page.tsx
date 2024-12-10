"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: React-Error-Boundary",
    path: "/demo1/",
  },
  {
    title: "Demo 2: Next.js Error Page",
    path: "/demo2/",
  },
  {
    title:
      "Demo 3: React-Error-Boundary for right side panel with variants content",
    path: "/demo3/",
  },
];

const Page = () => {
  return <PageWithAccordions demos={demos} />;
};

export default Page;
