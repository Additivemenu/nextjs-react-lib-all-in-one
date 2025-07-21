"use client";

import React, { useRef, useEffect } from "react";
import "./styles.css";

interface CustomDivProps {
  onSelect?: ({
    event,
    payload,
  }: {
    event: Event;
    payload: Record<string, string>;
  }) => void;
}

const CustomDiv: React.FC<CustomDivProps> = ({ onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      onSelect?.({
        event,
        payload: { message: "Native Custom Div Clicked" },
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      onSelect?.({
        event,
        payload: { message: "Native Custom Div Key Down" },
      });
    };

    //! ?? when is the divRef gets a value in react component lifecycle?
    const div = divRef.current;
    if (div) {
      div.addEventListener("click", handleClick);
      div.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup
    return () => {
      if (div) {
        div.removeEventListener("click", handleClick);
        div.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [onSelect]);

  return (
    <div
      ref={divRef}
      tabIndex={0}
      className="menu-item px-4 py-2 bg-blue-500 text-white rounded"
    >
      Native Click Me
    </div>
  );
};

export default CustomDiv;
