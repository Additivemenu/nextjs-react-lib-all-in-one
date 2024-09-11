import React from "react";

const NormalPanel = () => {
  return (
    <div>
      <h2 className="text-xl font-bold p-4">Normal Panel</h2>
      <p className="px-4">
        This is a normal panel. Nothing will happen if you click the button
        below.
      </p>
      <button
        onClick={() => {
          alert("You clicked the button.");
        }}
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        Click me
      </button>
    </div>
  );
};

export default NormalPanel;
