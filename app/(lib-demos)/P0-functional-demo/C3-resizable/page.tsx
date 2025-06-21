"use client";

import React from "react";
import ResizableDemo from "@/app/_components/wrappers/resizable/demo";

const Page = () => {
  return (
    <div className="w-full h-[calc(100vh-var(--top-nav-height))]">
      <ResizableDemo />;
    </div>
  );
};

export default Page;
