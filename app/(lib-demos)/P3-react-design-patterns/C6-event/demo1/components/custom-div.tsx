"use client";

import React from "react";
import "./styles.css";

interface CustomDivProps {
  onSelect?: ({
    event,
    payload,
  }: {
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>;
    payload: Record<string, string>;
  }) => void;
}

const CustomDiv: React.FC<CustomDivProps> = ({ onSelect }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Custom event handling logic
    console.log("Custom Div Clicked", event);
    onSelect?.({
      event,
      payload: { message: "Custom Div Clicked" },
    });
  };

  // Higher order function to handle keydown events
  // we lift onSelect logic into parent component to gain more flexibility and flexibility in parent component
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onSelect?.({
      event,
      payload: { message: "Custom Div Key Down" },
    });
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make div focusable so that it can receive keyboard events
      className="menu-item px-4 py-2 bg-green-500 text-white rounded"
    >
      Click Me
    </div>
  );
};

export default CustomDiv;
