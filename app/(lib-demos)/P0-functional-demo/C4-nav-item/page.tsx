"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";

const Page = () => {
  return (
    <div>
      <LinkButton filePath={readmePath} />
    </div>
  );
};

export default Page;
