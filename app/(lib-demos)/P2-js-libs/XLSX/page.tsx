"use client";

import React from "react";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: read large excel file certain row",
    path: "/demo1/",
    style: " underline",
    description:
      "only read a certain row from a large excel file with web worker, but no caching",
    links: [
      {
        name: "useMutation official doc",
        link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
    ],
  },
  {
    title: "Demo 1-1: read large excel file certain row",
    path: "/demo1-1/",
    style: " underline",
    description: "upgrade from demo1, with caching mechanism",
    links: [
      {
        name: "useMutation official doc",
        link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
    ],
  },
];

const Page: React.FC = () => {
  return (
    <>
      <PageWithAccordions demos={demos} />
    </>
  );
};

export default Page;
