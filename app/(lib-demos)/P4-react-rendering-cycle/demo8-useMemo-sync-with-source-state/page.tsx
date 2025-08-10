"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimingLog {
  timestamp: number;
  event: string;
  renderCycle: number;
  phase: "render" | "effect";
}

export default function UseMemoSyncProofPage() {
  const [sourceValue, setSourceValue] = useState("initial");
  const [logs, setLogs] = useState<TimingLog[]>([]);
  const renderCountRef = useRef(0);
  const startTimeRef = useRef<number>(performance.now());

  // Increment render count
  renderCountRef.current += 1;
  const currentRender = renderCountRef.current;

  console.log(`\n🔄 RENDER CYCLE #${currentRender} STARTED`);
  console.log(`📥 Source Value: "${sourceValue}"`);

  // 🎯 PROOF 1: useMemo computation is synchronous
  const derivedValue = useMemo(() => {
    const computationStart = performance.now() - startTimeRef.current;
    console.log(
      `  ⚡ useMemo computation starting at ${computationStart.toFixed(2)}ms`,
    );

    // Simulate some computation - removed Date.now() to avoid unnecessary recalculation
    const result = `DERIVED_${sourceValue.toUpperCase()}_COMPUTED`;

    const computationEnd = performance.now() - startTimeRef.current;
    console.log(
      `  ✅ useMemo computation completed at ${computationEnd.toFixed(2)}ms`,
    );
    console.log(`  📤 Derived value: "${result}"`);

    return result;
  }, [sourceValue]); // Only depend on sourceValue

  // 🎯 PROOF 2: Both values are available immediately in the same render
  console.log(`🏁 RENDER CYCLE #${currentRender} ENDING`);
  console.log(`📊 Final state in render #${currentRender}:`);
  console.log(`  • Source: "${sourceValue}"`);
  console.log(`  • Derived: "${derivedValue}"`);
  console.log(`  • Both available simultaneously ✅`);

  // 🎯 PROOF 3: useEffect runs AFTER render (asynchronous)
  useEffect(() => {
    const currentRenderAtEffect = renderCountRef.current;
    const effectTime = performance.now() - startTimeRef.current;
    console.log(
      `\n🔚 useEffect running AFTER render #${currentRenderAtEffect} at ${effectTime.toFixed(
        2,
      )}ms`,
    );

    // Add log entry without causing re-render during render
    setLogs((prev) => [
      ...prev,
      {
        timestamp: effectTime,
        event: `useEffect executed for render #${currentRenderAtEffect}`,
        renderCycle: currentRenderAtEffect,
        phase: "effect" as const,
      },
    ]);
  }, [sourceValue]); // Only depend on sourceValue

  //!
  const handleUpdateSource = () => {
    const newValue = `value_${Date.now() % 10000}`;
    console.log(`\n🚀 USER ACTION: Updating source to "${newValue}"`);

    // Add log entry immediately without causing render cycle issues
    setLogs((prev) => [
      ...prev,
      {
        timestamp: performance.now() - startTimeRef.current,
        event: `User clicked - setting source to "${newValue}"`,
        renderCycle: renderCountRef.current,
        phase: "render" as const,
      },
    ]);

    setSourceValue(newValue);
  };

  const clearLogs = () => {
    setLogs([]);
    renderCountRef.current = 0;
    startTimeRef.current = performance.now();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>
            🔬 Proof: useMemo is Synchronous with Source State
          </CardTitle>
          <p className="text-sm text-gray-600">
            This demo proves that useMemo computations happen synchronously in
            the same render cycle
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current State Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Source Value:
              </label>
              <div className="text-lg font-mono bg-blue-100 p-2 rounded mt-1">
                {sourceValue}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Derived Value (useMemo):
              </label>
              <div className="text-lg font-mono bg-green-100 p-2 rounded mt-1">
                {derivedValue}
              </div>
            </div>
          </div>

          {/* Render Counter */}
          <div className="flex items-center gap-4">
            <Badge variant="outline">Render Cycle: #{currentRender}</Badge>
            <Badge variant={logs.length > 0 ? "default" : "secondary"}>
              Logs: {logs.length}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleUpdateSource} size="lg">
              🚀 Update Source Value
            </Button>
            <Button onClick={clearLogs} variant="outline">
              🧹 Clear Logs
            </Button>
          </div>

          {/* Proof Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-700">
                  🎯 Proof #1
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <strong>useMemo runs during render:</strong>
                <br />
                Check console logs to see useMemo computation happens
                immediately when source changes.
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700">
                  🎯 Proof #2
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <strong>Both values available immediately:</strong>
                <br />
                Source and derived values are both accessible in the same render
                cycle.
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-orange-700">
                  🎯 Proof #3
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <strong>useEffect is asynchronous:</strong>
                <br />
                useEffect runs AFTER render completes, showing the difference.
              </CardContent>
            </Card>
          </div>

          {/* Execution Timeline */}
          <div>
            <h3 className="font-semibold mb-3">📋 Execution Timeline</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">
                  Click &quot;Update Source Value&quot; to see the execution
                  timeline...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1 flex items-center gap-2">
                    <span className="text-blue-400">
                      [{log.timestamp.toFixed(2)}ms]
                    </span>
                    <Badge
                      variant={log.phase === "render" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      R{log.renderCycle}
                    </Badge>
                    <span
                      className={
                        log.phase === "effect"
                          ? "text-orange-400"
                          : "text-green-400"
                      }
                    >
                      {log.event}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              🔑 Key Insights
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • <strong>Synchronous:</strong> useMemo computation happens
                immediately during render
              </li>
              <li>
                • <strong>Same cycle:</strong> Source and derived values are
                always in sync
              </li>
              <li>
                • <strong>Performance:</strong> Memoization prevents unnecessary
                recalculations
              </li>
              <li>
                • <strong>Predictable:</strong> No race conditions or timing
                issues
              </li>
            </ul>
          </div>

          {/* Console Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              🎯 How to Verify
            </h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Open browser DevTools → Console</li>
              <li>2. Click &quot;Update Source Value&quot; button</li>
              <li>3. Watch the console logs show synchronous execution</li>
              <li>
                4. Notice useMemo runs during render, useEffect runs after
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
