"use client";

import NavigationGuard from "@/components/guards/hooks/useNavigationGuard";
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
  {
    title: "C3: modal manager",
    path: "/C3-modal-manager/",
    style: "text-purple-500 underline",
  },
  {
    title: "C4: controlled & uncontrolled",
    path: "/C4-controlled-uncontrolled-comp/",
    style: "text-blue-500 underline",
  },
];

export default function Home() {
  return (
    <>
      <NavigationGuard />
      <PageWithAccordions demos={content} />
    </>
  );
}
