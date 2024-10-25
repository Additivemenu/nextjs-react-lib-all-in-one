"use client";

import { useEffect, useState } from "react";

/**
 * order: 
 * 
 * sync code
 * state update
 * useEffect cleanup
 * useEffect
 * micro-task
 * macro-task
 *
 *
 */
const Page = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    console.log("1. Synchronous code start"); // 1st

    setCounter((prev) => {
      console.log("4. React state update"); // 4th
      return prev + 1;
    });

    Promise.resolve().then(() => {
      console.log("2. First microtask"); // 2nd
    });

    setTimeout(() => {
      console.log("6. Macrotask"); // 6th
    }, 0);

    Promise.resolve().then(() => {
      console.log("3. Second microtask"); // 3rd
    });

    console.log("1. Synchronous code end"); // 1st
  };

  useEffect(() => {
    console.log("5. React useEffect after render"); // 5th

    return () => {
      console.log("Cleanup from previous effect");
    };
  }, [counter]);

  return <button onClick={handleClick}>Click me</button>;
};

export default Page;
