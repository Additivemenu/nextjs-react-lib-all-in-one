"use client";

// app/some-error-component.tsx
import React, { useState } from "react";

export default function BombComponent() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("This is an intentional error.");
  }

  return (
    <div className="text-center">
      <p className="text-lg">Click the button to trigger an error.</p>
      <button
        onClick={() => setHasError(true)}
        className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Trigger Error
      </button>
    </div>
  );
}
