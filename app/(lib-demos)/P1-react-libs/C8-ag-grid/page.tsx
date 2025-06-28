"use client";

import React, { useMemo, useRef, useState } from "react";
import { readmePath } from "./readme-path";
import { MarkdownViewer } from "@/components/viewers/markdown-view";

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">AG Grid Demos</h1>
      <p className="mb-4">
        This page demonstrates how to work with AG Grid in a React application.
      </p>
      <MarkdownViewer filePath={readmePath} />
    </div>
  );
};

export default Page;
