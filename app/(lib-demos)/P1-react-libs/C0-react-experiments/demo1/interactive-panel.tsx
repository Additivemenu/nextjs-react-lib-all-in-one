"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Minus, RotateCw } from "lucide-react";

type InteractivePanelProps = {
  title?: string;
};

const InteractivePanel = ({
  title = "Interactive Controls",
}: InteractivePanelProps) => {
  const [count, setCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="w-[500px] h-[300px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Counter Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCount((prev) => prev - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-2xl font-bold min-w-12 text-center">
              {count}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCount((prev) => prev + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Reset Button */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setCount(0)}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset Counter
          </Button>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable Feature</span>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractivePanel;
