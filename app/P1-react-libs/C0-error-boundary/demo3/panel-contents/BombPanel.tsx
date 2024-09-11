import React from "react";

const BombPanel = () => {
  return (
    <div>
      <h2 className="text-xl font-bold p-4">Bomb Panel</h2>
      <p className="px-4">
        This is a bomb panel. It will explode if you click the button below.
      </p>

      <button
        onClick={() => {
          throw new Error("Boom! The panel exploded.");
        }}
        className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Explode
      </button>
    </div>
  );
};

export default BombPanel;
