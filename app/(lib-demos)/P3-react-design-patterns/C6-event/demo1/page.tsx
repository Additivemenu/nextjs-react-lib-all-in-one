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
            // based on the context, you can handle the event and payload here in your own logic
            console.log(
              "onSelect code running in parent component:",
              event,
              payload,
            );

            if (event.type === "click") {
              alert("Handling click event in parent component");
            }
            if (event.type === "keydown") {
              // cast event to KeyboardEvent
              event = event as React.KeyboardEvent<HTMLDivElement>;

              alert(
                "Handling keydown event in parent component" +
                  "\n ctrl:" +
                  event.ctrlKey +
                  "\n shift:" +
                  event.shiftKey +
                  "\n alt:" +
                  event.altKey +
                  "\n key:" +
                  event.key,
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default Page;
