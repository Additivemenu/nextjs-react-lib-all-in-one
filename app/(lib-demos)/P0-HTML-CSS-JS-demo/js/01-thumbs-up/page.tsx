"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";
import { usePathname } from "next/navigation";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import ThumbsUpDemo from "./ThumbsUpDemo";

const Page = () => {
  const pathname = usePathname();
  const dynamicPath = pathname.split("/").pop();

  // Option 1: Use local demo files via a single HTML file with inline CSS/JS
  const localDemoPath = `/demos/html/${dynamicPath}.html`;

  // Option 2: Keep using public folder (fallback)
  const htmlFilePath = `/demos/js/${dynamicPath}/index.html`;

  // Add some debugging
  console.log("pathname:", pathname);
  console.log("localDemoPath:", localDemoPath);

  return (
    <div className="h-full w-full">
      <PageToolbar readmePath={readmePath} htmlFilePath={htmlFilePath} />

      {/* Option 1: Use iframe with local files */}
      <iframe
        src={localDemoPath}
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
