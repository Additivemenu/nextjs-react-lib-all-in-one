"use client";

import { usePathname } from "next/navigation";
import React from "react";

const demos = [
  {
    title: "Demo 1: simple react flow",
    path: "/demo1/",
  },
  {
    title: "Demo 2: react flow + Zustand (devtools)",
    path: "/demo2/",
  },
];

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
