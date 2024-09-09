// app/error.tsx
"use client"; // This is necessary for client-side rendering of error components in Next.js

import React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * check Next.js component hierarchy:
 * https://nextjs.org/docs/app/building-your-application/routing#component-hierarchy
 *
 * @param param0
 * @returns
 */
export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong!
        </h2>
        <p className="mt-4 text-gray-600">Error message: {error.message}</p>
        <button
          onClick={reset}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
