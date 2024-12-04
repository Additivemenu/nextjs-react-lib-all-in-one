"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ContentItem = {
  title: string;
  path: string;
  style?: string;
};

const content: ContentItem[] = [
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
    title: "C6 driver.js",
    path: "/C6-driver-js/",
    style: "text-red-500 underline",
  },
  {
    title: "C6 intro.js",
    path: "/C6-intro-js/",
    style: "text-red-500 underline",
  },
  {
    title: "C6 react joyride",
    path: "/C6-react-joyride/",
    style: "text-red-500 underline",
  },
];

export default function Home() {
  const pathname = usePathname();

  return (
    <>
      <h2 className="text-red-500">
        {" "}
        try to keep each page as independent as possible
      </h2>
      {content.map((item) => (
        <Link key={item.title} href={pathname + item.path}>
          <h1 className={`text-2xl font-bold ${item.style ?? ""}`}>
            {item.title}
          </h1>
        </Link>
      ))}
    </>
  );
}
