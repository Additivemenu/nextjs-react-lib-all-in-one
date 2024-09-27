"use client";

import React from "react";
import { usePathname } from "next/navigation";

const demos = [
  {
    title: "Demo 1: React-Error-Boundary",
    path: "/demo1/",
  },
  {
    title: "Demo 2: Next.js Error Page",
    path: "/demo2/",
  },
  {
    title:
      "Demo 3: React-Error-Boundary for right side panel with variants content",
    path: "/demo3/",
  },
];

const Page = () => {
  const pathname = usePathname();
  console.log(pathname);

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
                className="text-blue-500 hover:underline"
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
