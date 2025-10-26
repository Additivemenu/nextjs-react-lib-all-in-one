"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";
import { usePathname } from "next/navigation";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import ThumbsUpDemo from "./ThumbsUpDemo";
import { useHtmlFilePath } from "../../(hooks)/useHtmlFilePath";

const Page = () => {
  const pathname = usePathname();
  const dynamicPath = pathname.split("/").pop();

  // Option 1: Use local demo files via a single HTML file with inline CSS/JS
  const localDemoPath = `/demos/html/${dynamicPath}.html`;

  // Option 2: Keep using public folder (fallback)
  // const htmlFilePath = `/app/(lib-demos)/${pathname}/demo/index.html`;

  const htmlFilePath = useHtmlFilePath();
  const srcCodeFilePath = `/public${htmlFilePath}`;

  // Add some debugging
  console.log("pathname:", pathname);
  console.log("localDemoPath:", localDemoPath);
  console.log("htmlFilePath:", htmlFilePath);

  return (
    <div className="h-full w-full">
      <PageToolbar readmePath={readmePath} htmlFilePath={srcCodeFilePath} />

      {/* Option 1: Use iframe with local files */}
      <iframe
        src={htmlFilePath} // "/demos/js/01-thumbs-up/index.html"
        width="100%"
        height="80%"
        frameBorder="0"
        title="Thumbs Up Demo - Local Version"
        onLoad={() => console.log("Iframe loaded successfully")}
        onError={(e) => console.error("Iframe error:", e)}
      />

      {/* Option 2: Direct React integration (recommended) */}
      {/* <div className="h-[80%] w-full">
        <ThumbsUpDemo />
      </div> */}
    </div>
  );
};

export default Page;
