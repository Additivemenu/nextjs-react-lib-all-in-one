import { useState } from "react";

// Simulating a component that throws an error
export function BombComponent() {
  const [explode, setExplode] = useState(false);

  if (explode) {
    throw new Error("Boom! The component exploded.");
  }

  return (
    <div className="text-center my-6">
      <p className="text-lg">Click the button to trigger an error.</p>
      <button
        onClick={() => setExplode(true)}
        className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Explode
      </button>
    </div>
  );
}
