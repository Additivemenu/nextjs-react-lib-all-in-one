"use client";

import React from "react";
import CustomDiv from "./components/custom-div";

const Page = () => {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Event Handling in React</h1>
      <p className="mb-4">
        This page demonstrates how to handle events in React components. You can
        add your event handling logic here.
      </p>
      <div className="space-y-4">
        <CustomDiv
          onSelect={({ event, payload }) => {
            console.log(
              "onSelect code running in parent component:",
              event,
              payload,
            );

            if (event.type === "click") {
              alert("Handling click event in parent component");
            }
            if (event.type === "keydown") {
              // Cast event to native KeyboardEvent
              const keyboardEvent = event as KeyboardEvent;

              if (
                keyboardEvent.ctrlKey ||
                keyboardEvent.shiftKey ||
                keyboardEvent.altKey
              ) {
                if (
                  !["control", "shift", "alt", "meta"].includes(
                    keyboardEvent.key.toLowerCase(),
                  )
                ) {
                  // Exclude simple key presses like ctrl, shift, alt
                  console.warn(
                    "Handling composite keydown event in parent component" +
                      "\n ctrl:" +
                      keyboardEvent.ctrlKey +
                      "\n shift:" +
                      keyboardEvent.shiftKey +
                      "\n alt:" +
                      keyboardEvent.altKey +
                      "\n key:" +
                      keyboardEvent.key,
                  );
                }
              } else {
                console.log(
                  "Handling simple keydown event in parent component" +
                    "\n ctrl:" +
                    keyboardEvent.ctrlKey +
                    "\n shift:" +
                    keyboardEvent.shiftKey +
                    "\n alt:" +
                    keyboardEvent.altKey +
                    "\n key:" +
                    keyboardEvent.key,
                );
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Page;
