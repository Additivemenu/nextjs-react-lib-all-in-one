"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";

const htmlFilePath = "/public/demos/css/01-css-pseudo-class/index.html"; // should be `/public/demo/${dynamicPath}/index.html`

const Page = () => {
  // TODO: worth to import the html file path dynamically

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
