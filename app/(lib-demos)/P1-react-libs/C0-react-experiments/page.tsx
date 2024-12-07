"use client";

import React from "react";
import { usePathname } from "next/navigation";

const demos = [
  {
    title: "Demo 0: PostHog feature flag",
    path: "/demo0/",
  },
  {
    title: "Demo 1: overlaying and disable an interface",
    path: "/demo1/",
  },
  {
    title: "Demo 2: react-portal",
    path: "/demo2/",
  },
  {
    title: "Demo 3: react suspense",
    path: "/demo3/",
  },
  {
    title: "Demo 4: mutation observer + react chatbotify",
    path: "/demo4/",
  },
  {
    title: "Demo 4-1: useEffect + react chatbotify -> not working actually",
    path: "/demo4-1/",
  },
  {
    title: "Demo 4-2: mutation observer + react chatbotify + SSE",
    path: "/demo4-2/",
  },
  {
    title: "Demo 5: server-sent event (SSE)",
    path: "/demo5/",
  },
  {
    title: "Demo 5-1: SSE for chat session viewer, in react",
    path: "/demo5-1/",
  },
  {
    title: "Demo 5-2: SSE for chat session viewer, but in DOM",
    path: "/demo5-2/",
  },
  {
    title: "Demo 5-3: SSE for long running task progress tracking (still doing)",
    path: "/demo5-3/",
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
