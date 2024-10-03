"use client";
import React, { useState, useEffect } from "react";


/**
 * a simple useEffect in react component life cycle demo
 * @returns 
 */
export default function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // Effect 1: Runs on every render
  useEffect(() => {
    console.log("Effect 1: This effect runs on every render");
  });

  // Effect 2: Runs only on mount (first render)
  useEffect(() => {
    console.log("Effect 2: This effect runs only on mount");
    return () => {
      console.log("Effect 2 Cleanup: This runs when the component unmounts");
    };
  }, []);

  // Effect 3: Runs when count changes
  useEffect(() => {
    console.log(`Effect 3: The count is now ${count}`);
  }, [count]);

  // Effect 4: Runs when name changes
  useEffect(() => {
    console.log(`Effect 4: The name is now "${name}"`);
  }, [name]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">useEffect Demo</h1>
      <div className="mb-4">
        <p className="text-gray-600">Count: {count}</p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment Count
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <p className="text-sm text-gray-500">
        Check the console to see when effects run!
      </p>
    </div>
  );
}
