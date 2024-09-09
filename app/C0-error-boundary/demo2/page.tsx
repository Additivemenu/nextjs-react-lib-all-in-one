import React from "react";
import BombComponent from "./BombComponent";

export default function HomePage() {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Next.js Error Page Example
        </h1>
        <BombComponent />
      </div>
    </div>
  );
}
