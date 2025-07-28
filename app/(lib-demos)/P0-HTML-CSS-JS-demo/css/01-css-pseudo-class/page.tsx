"use client";

import ReadmeLink from "@/components/links/ReadmeLink";
import React from "react";
import { readmePath } from "./readme-path";

const Page = () => {
  // TODO: worth to import the html file path dynamically

  return (
    <div className="h-full w-full">
      <ReadmeLink readmePath={readmePath} />
      <iframe
        src="/demos/css/01-css-pseudo-class/index.html"
        width="100%"
        height="80%"
        frameBorder="0"
        title="Demo 1"
      />
    </div>
  );
};

export default Page;
