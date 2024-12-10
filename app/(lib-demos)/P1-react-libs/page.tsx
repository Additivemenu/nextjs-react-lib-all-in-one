"use client";

import PageWithAccordions from "@/components/pages/page-with-accordions";

const content = [
  {
    title: "C0: react experiments",
    path: "/C0-react-experiments/",
  },
  {
    title: "C0: error boundary",
    path: "/C0-error-boundary/",
    style: "text-red-500 underline",
  },
  {
    title: "C1-framer-motion",
    path: "/C1-framer-motion/",
  },
  {
    title: "C2-react-flow",
    path: "/C2-react-flow/",
    style: "text-purple-500 underline",
  },
  {
    title: "C3-react-query",
    path: "/C3-react-query/",
  },
  {
    title: "C4-zustand",
    path: "/C4-zustand/",
  },
  {
    title: "C5-react-hook-form-zod",
    path: "/C5-react-hook-form-zod/",
    style: "text-red-500 underline",
  },
  {
    title: "C6 onboarding libs",
    path: "/C6-onboarding-libs/",
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
