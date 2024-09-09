"use client";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "./ErrorFallback";
import { BombComponent } from "./BombComponent";

const Page = () => {
  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Error Boundary Example
        </h1>

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // Reset the state of your app on reset
            console.log("Resetting the app...");
          }}
        >
          <BombComponent />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Page;
