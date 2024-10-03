"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type ContentItem = {
  title: string;
  path: string;
  style?: string;
};

const content: ContentItem[] = [
  {
    title: "demo1: ",
    path: "/demo1/",
  },
  {
    title: "demo2: ",
    path: "/demo2/",
    style: "text-red-500 underline",
  },
  {
    title: "demo3: useEffect simple case",
    path: "/demo3/",
  
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
