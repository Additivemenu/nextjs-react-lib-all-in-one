"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";
import { useHtmlFilePath } from "@/app/(lib-demos)/P0-HTML-CSS-JS-demo/(hooks)/useHtmlFilePath";

const Page = () => {
  // useHtmlFilePath strips the section segment, matching what
  // copy-paste-demo-to-public.ts does at build time:
  // /P2-js-libs/code-mirror/demo1 -> /demos/code-mirror/demo1/index.html
  const htmlFilePath = useHtmlFilePath();
  const srcCodeFilePath = `public${htmlFilePath}`;

  return (
    <div className="h-full w-full">
      <div className="flex gap-2 p-2">
        <LinkButton filePath={readmePath} />
        <LinkButton filePath={srcCodeFilePath} label="source code" />
      </div>
      <iframe
        src={htmlFilePath}
        width="100%"
        height="90%"
        frameBorder="0"
        title="CodeMirror 6 Basic JavaScript Editor"
      />
    </div>
  );
};

export default Page;
