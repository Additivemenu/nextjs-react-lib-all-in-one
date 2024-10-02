"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

export default function CounterDemo() {
  console.log("Component rendering");

  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  useEffect(() => {
    console.log("Effect running - count changed:", count);
    return () => {
      console.log("Cleanup from previous effect");
    };
  }, [count]);

  const doubledCount = useMemo(() => {
    console.log("Calculating doubledCount");
    return count * 2;
  }, [count]);

  const incrementCount = useCallback(() => {
    console.log("Increment function called");
    setCount((prevCount) => prevCount + 1);
  }, []);

  const updateOtherState = () => {
    setOtherState((prev) => prev + 1);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">React Rendering Cycle Demo</h1>
      <p className="mb-2">Count: {count}</p>
      <p className="mb-2">Doubled Count: {doubledCount}</p>
      <p className="mb-2">Other State: {otherState}</p>
      <div className="space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
          onClick={incrementCount}
        >
          Increment Count
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
          onClick={updateOtherState}
        >
          Update Other State
        </button>
      </div>
    </div>
  );
}
