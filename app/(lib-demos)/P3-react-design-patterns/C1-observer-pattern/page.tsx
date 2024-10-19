"use client";

import React from "react";
import { usePathname } from "next/navigation";

const demos = [
  {
    title: "Demo 1: zustand store subscription",
    path: "/demo1/",
  },
  {
    title: "Demo 2: zustand even driven",
    path: "/demo2/",
    style: "text-purple-500 underline",
  },
];

/**
 * the most important thing about reducer pattern is: Separating the what (the action) from the how (the state update logic)
 *
 * @returns
 */
const Page = () => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">reducer pattern</h1>
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
