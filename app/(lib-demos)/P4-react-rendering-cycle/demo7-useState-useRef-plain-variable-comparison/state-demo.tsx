"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Timer, Variable } from "lucide-react";

const StateDemo = () => {
  // 1. Normal variable - resets on every render
  let normalVariable = 0;

  // 2. useState - persists between renders and triggers re-render
  const [stateVariable, setStateVariable] = useState<number>(0);

  // 3. useRef - persists between renders but doesn't trigger re-render
  const refVariable = useRef<number>(0);

  const updateNormalVariable = () => {
    normalVariable += 1;
    console.log("Normal variable:", normalVariable);
    // This won't update the UI since it's just a regular variable
  };

  const updateStateVariable = () => {
    setStateVariable((prev) => prev + 1);
    // ! This will update the UI since useState triggers a re-render
  };

  const updateRefVariable = () => {
    refVariable.current += 1;
    console.log("Ref variable:", refVariable.current);
    // ! This updates the value but won't trigger a re-render
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Variable className="h-6 w-6" />
            Normal Variable
          </CardTitle>
          <CardDescription>
            Resets on every render. Current value: {normalVariable}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateNormalVariable} variant="outline">
            Increment Normal Variable
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            useState Variable
          </CardTitle>
          <CardDescription>
            Persists and triggers re-render. Current value: {stateVariable}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateStateVariable} variant="default">
            Increment State Variable
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            useRef Variable
          </CardTitle>
          <CardDescription>
            <span>
              Persists but doesn&apos;t trigger re-render. Current value:{" "}
            </span>
            {refVariable.current}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateRefVariable} variant="secondary">
            Increment Ref Variable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateDemo;
