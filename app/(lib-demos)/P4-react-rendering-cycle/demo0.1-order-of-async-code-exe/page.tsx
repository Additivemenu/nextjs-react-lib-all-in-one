"use client";

import { useEffect, useRef, useState } from "react";
import SimpleModalTrigger from "@/app/_components/modals/simple-modal";
import { MarkdownViewer } from "@/components/viewers/markdown-view";
import { readmePath } from "./readme-path";
import { generateReadmeURL } from "@/lib/utils";
/**
 * order from observation:
 *
 * sync code
 * callback in setState for state updates  --> rendering phase
 * ... React commit phase
 * useEffect cleanup callback for previous effect  --> effect phase
 * useEffect callback for current effect --> effect phase
 * ... React调度结束, 开始执行微任务和宏任务
 * micro-task - e.g. Promise.then
 * macro-task - e.g. setTimeout
 *
 *
 */
const Page = () => {
  const [counter, setCounter] = useState(0);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  console.log("Render count:", renderCountRef.current);

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

  const handleSameValueClick = () => {
    //! as the counter state is a primitive type,
    //! setting the same value will not trigger a re-render, and of course, no useEffect will be called.
    setCounter((prev) => {
      console.log(
        "setCounter, React state update with same value for primitive type value",
      );
      return prev; // setting the same value
    });
  };

  useEffect(() => {
    console.log(
      "5. React useEffect after committing real DOM changes, counter is",
      counter,
    ); // 5th

    return () => {
      console.log("Cleanup from previous effect - counter was", counter); // cleanup
    };
  }, [counter]);

  return (
    <>
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        href={generateReadmeURL(readmePath)}
      >
        link to notes
      </a>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleClick}
          className="border border-black p-2 hover:bg-slate-500 hover:text-teal-50"
        >
          +1
        </button>
        <button
          onClick={handleSameValueClick}
          className="border border-black p-2 hover:bg-slate-500 hover:text-teal-50"
        >
          set counter as the same value as prev
        </button>
      </div>
      <div>Counter: {counter}</div>
    </>
  );
};

export default Page;
