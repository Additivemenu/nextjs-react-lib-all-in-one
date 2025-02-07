"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 0: PostHog feature flag",
    path: "/demo0/",
  },
  {
    title: "Demo 1: overlaying and disable an interface",
    path: "/demo1/",
  },
  {
    title: "Demo 2: react-portal",
    path: "/demo2/",
  },
  {
    title: "Demo 2-1: shadcn dialog modal click through",
    path: "/demo2-1/",
  },
  {
    title: "Demo 2-2: material UI dialog modal click through",
    path: "/demo2-2/",
  },
  {
    title: "Demo 3: react suspense",
    path: "/demo3/",
  },
  {
    title: "Demo 4-0: mutation observer + react chatbotify",
    path: "/demo4-0/",
  },
  {
    title: "Demo 5-0: server-sent event (SSE)",
    path: "/demo5-0/",
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
