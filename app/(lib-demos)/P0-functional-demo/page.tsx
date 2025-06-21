"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const content = [
  {
    title: "C1: chatbot",
    path: "/C1-chatbot/",
    style: "text-red-500 underline",
  },
  {
    title: "C3: resizable",
    path: "/C3-resizable/",
    style: "text-red-500 underline",
  },
];

export default function Home() {
  return (
    <>
      <PageWithAccordions demos={content} />
    </>
  );
}
