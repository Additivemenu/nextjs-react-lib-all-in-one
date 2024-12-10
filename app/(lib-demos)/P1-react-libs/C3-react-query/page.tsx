"use client";

import React from "react";
import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: useQuery status: isLoading, isFetching, isError, isSuccess",
    path: "/demo1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 1-1: useQuery status: isFetching vs. isLoading",
    path: "/demo1-1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 2-1: useMutation",
    path: "/demo2-1/",
    style: " underline",
    description: "useMutation basic usage",
    links: [
      {
        name: "useMutation official doc",
        link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
    ],
  },
];

/**
 *
 *
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
