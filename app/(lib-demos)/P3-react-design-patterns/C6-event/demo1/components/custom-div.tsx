"use client";

import React from "react";

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Custom keyboard event handling logic
    console.log("Custom Div Key Down", event);
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
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Click Me
    </div>
  );
};

export default CustomDiv;
