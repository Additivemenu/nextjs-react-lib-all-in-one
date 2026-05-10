"use client";

import React, { useState } from "react";
import { MovableDnd } from "@/app/_components/wrappers/movable/movable-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import { readmePath } from "./readme-path";

// ─── Floating widget shown inside the MovableDnd wrapper ─────────────────────
const FloatingWidget = ({
  label,
  color,
  onClick,
  clickCount,
}: {
  label: string;
  color: string;
  onClick: () => void;
  clickCount: number;
}) => (
  <div
    className={`${color} rounded-2xl shadow-2xl p-4 flex flex-col items-center gap-2 w-36 select-none`}
  >
    <span className="text-white font-bold text-sm">{label}</span>
    <button
      onClick={onClick}
      className="bg-white/20 hover:bg-white/40 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
    >
      Click me
    </button>
    {clickCount > 0 && (
      <span className="text-white/80 text-xs">clicked {clickCount}×</span>
    )}
    <span className="text-white/60 text-[10px] mt-1">drag to move</span>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
export default function MovableDndDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [showB, setShowB] = useState(false);

  return (
    <div className="w-full h-full overflow-y-auto">
      <PageToolbar readmePath={readmePath} />
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            MovableDnd — Framer-Motion Draggable Wrapper
          </h1>
          <div className="flex flex-wrap gap-2">
            {[
              "framer-motion",
              "useMotionValue",
              "dragConstraints",
              "localStorage",
              "viewport clamping",
            ].map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Same behaviour as the pointer-events version, but implemented with
              framer-motion. <code>useMotionValue</code> drives the CSS
              transform without React re-renders on each frame. Drag constraints
              are enforced declaratively via the <code>dragConstraints</code>{" "}
              prop. Clicking the button inside each widget increments a counter
              to verify clicks are not swallowed after a drag.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button size="sm" onClick={() => setShowB((v) => !v)}>
                {showB ? "Hide" : "Show"} second widget
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("movable-dnd-demo-a");
                  localStorage.removeItem("movable-dnd-demo-b");
                  window.location.reload();
                }}
              >
                Reset positions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Floating widgets ─────────────────────────────────────────────── */}
      <MovableDnd
        storageKey="movable-dnd-demo-a"
        defaultPosition={{ x: window.innerWidth - 180, y: 120 }}
        zIndex={9999}
      >
        <FloatingWidget
          label="Widget A"
          color="bg-sky-500"
          onClick={() => setCountA((c) => c + 1)}
          clickCount={countA}
        />
      </MovableDnd>

      {showB && (
        <MovableDnd
          storageKey="movable-dnd-demo-b"
          defaultPosition={{ x: window.innerWidth - 180, y: 280 }}
          zIndex={9998}
        >
          <FloatingWidget
            label="Widget B"
            color="bg-orange-500"
            onClick={() => setCountB((c) => c + 1)}
            clickCount={countB}
          />
        </MovableDnd>
      )}
    </div>
  );
}
