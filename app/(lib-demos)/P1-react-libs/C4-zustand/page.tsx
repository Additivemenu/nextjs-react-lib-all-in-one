"use client";

import { usePathname } from "next/navigation";
import path from "path";
import { title } from "process";
import React from "react";

const demos = [
  {
    title: "Demo 1: useEffect vs. subscribe",
    path: "/demo1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 2: todo modal - normal case",
    path: "/demo2/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 3: todo modal (programmatically)",
    path: "/demo3/",
    style: "text-red-500 underline",
  },
];

/**
 *
 *
 *
 */
const Page: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          React Error Boundary Demos
        </h1>
        <ul className="space-y-4">
          {demos.map((demo) => (
            <li key={demo.title}>
              <a
                href={pathname + demo.path}
                className={`hover:underline" + ${demo.style ?? ""}`}
              >
                {demo.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
