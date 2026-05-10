"use client";

import React, { useState } from "react";
import { Movable } from "@/app/_components/wrappers/movable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import { readmePath } from "./readme-path";

// ─── Floating widget shown inside the Movable wrapper ────────────────────────
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
export default function MovableDemo() {
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
            Movable — Pointer-Events Draggable Wrapper
          </h1>
          <div className="flex flex-wrap gap-2">
            {[
              "pointer events",
              "pointer capture",
              "drag threshold",
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
              Drag is implemented with raw Pointer Events — no animation
              library. A 2 px <code>DRAG_THRESHOLD</code> distinguishes a click
              from a drag before pointer capture is acquired. Each widget has
              its own <code>storageKey</code> so positions are persisted
              separately. Clicking the button inside each widget increments a
              counter to verify clicks are not swallowed after a drag.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button size="sm" onClick={() => setShowB((v) => !v)}>
                {showB ? "Hide" : "Show"} second widget
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("movable-demo-a");
                  localStorage.removeItem("movable-demo-b");
                  window.location.reload();
                }}
              >
                Reset positions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Floating widgets (rendered outside the scroll container intentionally) ── */}
      <Movable
        storageKey="movable-demo-a"
        defaultPosition={{ x: window.innerWidth - 180, y: 120 }}
        zIndex={9999}
      >
        <FloatingWidget
          label="Widget A"
          color="bg-violet-500"
          onClick={() => setCountA((c) => c + 1)}
          clickCount={countA}
        />
      </Movable>

      {showB && (
        <Movable
          storageKey="movable-demo-b"
          defaultPosition={{ x: window.innerWidth - 180, y: 280 }}
          zIndex={9998}
        >
          <FloatingWidget
            label="Widget B"
            color="bg-emerald-500"
            onClick={() => setCountB((c) => c + 1)}
            clickCount={countB}
          />
        </Movable>
      )}
    </div>
  );
}
