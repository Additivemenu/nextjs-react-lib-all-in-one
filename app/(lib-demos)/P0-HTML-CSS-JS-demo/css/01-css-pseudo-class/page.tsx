"use client";

import LinkButton from "@/components/links/LinkButton";
import React, { use, useMemo } from "react";
import { readmePath } from "./readme-path";
import { usePathname } from "next/navigation";
import { useHtmlFilePath } from "../../(hooks)/useHtmlFilePath";

const Page = () => {
  const htmlFilePath = useHtmlFilePath();

  return (
    <div className="h-full w-full">
      <LinkButton filePath={readmePath} />
      <LinkButton filePath={htmlFilePath} label="source code" />
      {/* https://github.com/Additivemenu/nextjs-react-lib-all-in-one/blob/main/public/demos/css/01-css-pseudo-class/index.html */}
      <iframe
        src={htmlFilePath} // "/demos/css/01-css-pseudo-class/index.html"
        width="100%"
        height="80%"
        frameBorder="0"
        title="Demo 1"
      />
    </div>
  );
};

export default Page;
