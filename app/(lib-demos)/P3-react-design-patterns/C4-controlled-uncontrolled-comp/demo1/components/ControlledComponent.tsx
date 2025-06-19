import React, { useState } from "react";

const ControlledComponent = () => {
  const [controlledValue, setControlledValue] = useState("");
  const [controlledDisplay, setControlledDisplay] = useState("");

  const handleControlledSubmit = () => {
    setControlledDisplay(controlledValue);
  };

  const clearControlled = () => {
    setControlledValue("");
    setControlledDisplay("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Controlled Component
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        React controls the input value through state. Every keystroke updates
        the state.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter text:
          </label>
          <input
            type="text"
            value={controlledValue}
            onChange={(e) => setControlledValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type something..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleControlledSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
          <button
            onClick={clearControlled}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>Current value:</strong> {controlledValue || "(empty)"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Submitted value:</strong> {controlledDisplay || "(none)"}
        </p>
      </div>
    </div>
  );
};

export default ControlledComponent;
