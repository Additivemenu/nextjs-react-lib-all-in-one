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
    title: "C1: XLSX",
    path: "/XLSX/",
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
