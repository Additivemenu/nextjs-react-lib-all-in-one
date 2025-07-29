"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const dynamicPath = pathname.split("/").pop();
  const htmlFilePath = `/public/demos/js/${dynamicPath}/index.html`;

  return (
    <div className="h-full w-full">
      <LinkButton filePath={readmePath} />
      <LinkButton filePath={htmlFilePath} label="source code" />
      {/* https://github.com/Additivemenu/nextjs-react-lib-all-in-one/blob/main/public/demos/css/01-css-pseudo-class/index.html */}
      <iframe
        src={htmlFilePath.replace("/public", "")}
        width="100%"
        height="80%"
        frameBorder="0"
        title="Demo 1"
      />
    </div>
  );
};

export default Page;
