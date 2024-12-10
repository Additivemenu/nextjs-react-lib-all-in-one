"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const content = [
  {
    title: "C0: reducer pattern",
    path: "/C0-reducer-pattern/",
    style: "text-red-500 underline",
  },
  {
    title: "C1: observer pattern",
    path: "/C1-observer-pattern/",
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
