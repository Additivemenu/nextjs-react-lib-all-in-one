"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import DisableOverlay from "./disable-overlay";
import InteractivePanel from "./interactive-panel";

const Page = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="p-4">
      <DisableOverlay
        disabled={isDisabled}
        message="Panel is locked" // optional custom message
      >
        <InteractivePanel title="My Controls" />
      </DisableOverlay>

      <Button className="mt-4" onClick={() => setIsDisabled(!isDisabled)}>
        Toggle Lock
      </Button>
    </div>
  );
};

export default Page;
