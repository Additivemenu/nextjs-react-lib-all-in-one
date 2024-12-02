"use client";

import React from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";

const SampleClientComp = () => {
  const flagEnabled = useFeatureFlagEnabled("my-flag");

  if (flagEnabled) {
    return <div>Flag is enabled!</div>;
  }

  return <div>flag not enabled!</div>;
};

export default SampleClientComp;
