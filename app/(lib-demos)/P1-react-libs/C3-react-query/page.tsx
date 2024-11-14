"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const demos = [
  {
    title: "Demo 1: useQuery status: isLoading, isFetching, isError, isSuccess",
    path: "/demo1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 1-1: useQuery status: isFetching vs. isLoading",
    path: "/demo1-1/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 2-1: useMutation",
    path: "/demo2-1/",
    style: " underline",
    description: "useMutation basic usage",
    links: [
      {
        name: "useMutation official doc",
        link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
    ],
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
        <Accordion type="single" collapsible>
          <ul className="space-y-4">
            {demos.map((demo, index) => (
              // <li key={demo.title}>
              <AccordionItem key={demo.title} value={`item-${index}`}>
                <AccordionTrigger
                  className={`hover:underline" + ${demo.style ?? ""}`}
                >
                  {demo.title}
                </AccordionTrigger>
                <AccordionContent className="pl-4 border-l-2 border-black">
                  <a
                    href={pathname + demo.path}
                    className={"text-purple-500 underline"}
                  >
                    check demo
                  </a>
                  <p className="my-2">{demo.description}</p>
                  <div>
                    {demo.links?.map((link) => (
                      <a
                        key={link.name}
                        href={link.link}
                        className="text-blue-500 underline"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              // </li>
            ))}
          </ul>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
