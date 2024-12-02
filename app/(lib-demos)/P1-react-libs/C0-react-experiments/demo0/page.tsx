import React from "react";
import SampleClientComp from "./sample-client";

// https://posthog.com/docs/libraries/next-js
// find your posthog key in your project settings
const Page = () => {
  return (
    <div>
      <SampleClientComp />
    </div>
  );
};

export default Page;
