import React, { useRef, useState } from "react";

const UncontrolledComponent = () => {
  // Uncontrolled component ref
  const uncontrolledRef = useRef(null);
  const [uncontrolledDisplay, setUncontrolledDisplay] = useState("");

  const handleUncontrolledSubmit = () => {
    if (uncontrolledRef.current) {
      setUncontrolledDisplay((uncontrolledRef.current as HTMLInputElement).value);
    }
  };

  const clearUncontrolled = () => {
    if (uncontrolledRef.current) {
      (uncontrolledRef.current as HTMLInputElement).value = "";
      setUncontrolledDisplay("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-600 mb-4">
        Uncontrolled Component
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        DOM controls the input value. React accesses it via ref when needed.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter text:
          </label>
          <input
            type="text"
            ref={uncontrolledRef}
            defaultValue=""
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Type something..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUncontrolledSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
          <button
            onClick={clearUncontrolled}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>Current value:</strong> (not tracked in React state)
        </p>
        <p className="text-sm text-gray-700">
          <strong>Submitted value:</strong> {uncontrolledDisplay || "(none)"}
        </p>
      </div>
    </div>
  );
};

export default UncontrolledComponent;
