import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const demos = [
  {
    title: "Demo 5: server-sent event (SSE)",
    path: "/demo5/",
  },
  {
    title: "Demo 5-1: SSE for chat session viewer, in react",
    path: "/demo5-1/",
  },
  {
    title: "Demo 5-2: SSE for chat session viewer, but in DOM",
    path: "/demo5-2/",
  },
  {
    title:
      "Demo 5-3: SSE for long running task progress tracking (still doing)",
    path: "/demo5-3/",
  },
];

const Page = () => {
  return (
    <>
      <PageWithAccordions demos={demos} />
    </>
  );
};

export default Page;
