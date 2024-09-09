import React from "react";
import { ErrorBoundary } from "react-error-boundary";

// Define a fallback component for the error boundary
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error; // react-error-boundary provides the error object
  resetErrorBoundary: () => void; // react-error-boundary provides a function to reset the error boundary
}) {
  return (
    <div
      role="alert"
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto my-4"
    >
      <strong className="font-bold">Oops! Something went wrong:</strong>
      <p className="mt-2 text-sm">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
