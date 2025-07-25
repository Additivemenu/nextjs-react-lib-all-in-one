"use client";

import ReadmeLink from "@/components/links/ReadmeLink";
import React from "react";
import { readmePath } from "./readme-path";

const Page = () => {
  return (
    <div>
      <ReadmeLink readmePath={readmePath} />
    </div>
  );
};

export default Page;
