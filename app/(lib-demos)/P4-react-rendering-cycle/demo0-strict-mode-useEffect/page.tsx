"use client";

import React, { useEffect, useState } from "react";
import SimpleModalTrigger from "@/app/_components/modals/simple-modal";
import { MarkdownViewer } from "@/components/viewers/markdown-view";
import { readmePath } from "./readme-path";

const Page = () => {
  useEffect(() => {
    console.log("Effect running");

    return () => {
      console.log("Cleanup from previous effect");
    };
  }, []);

  return (
    <div>
      <SimpleModalTrigger
        triggerText="see notes"
        modal={{
          title: "Simple Modal",
          content: <MarkdownViewer filePath={readmePath} />,
        }}
      />
      just a useEffect
    </div>
  );
};

export default Page;
