"use client";

import React from "react";
import { usePathname } from "next/navigation";

const demos = [
  {
    title: "Demo 1: task manager (useReducer, not using react-hook-form)",
    path: "/demo1/",
  },
  {
    title: "TODO: Demo 1-1: task manager (zustand + react-hook-form)",
    path: "/demo1-1/",
    style: "text-purple-500 underline",
  },
  {
    title:
      "Demo 2: task manager (useReducer with react-hook-form + zod + file break down)",
    path: "/demo2/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 3: todo list - just normal todo list with zustand",
    path: "/demo3/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 3-1: todo list - with sequence actions",
    path: "/demo3-1/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 3-2: todo list - with sequence actions",
    path: "/demo3-2/",
    style: "text-red-500 underline",
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
        <h1 className="text-2xl font-bold mb-6 text-center">
          reducer pattern.
        </h1>
        <p className="text-xl font-bold mb-6 text-center">
          Redux, Zustand also adopts this pattern
        </p>
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
