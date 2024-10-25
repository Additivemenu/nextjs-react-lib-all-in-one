import React from "react";
import { useTaskContext } from "../../context/context";

const RedoUndo = () => {
  const { state, dispatch } = useTaskContext();

  return (
    <div className="flex justify-end">
      <button
        onClick={() => dispatch({ type: "UNDO" })}
        disabled={state.historyIndex === 0}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Undo
      </button>
      <button
        onClick={() => dispatch({ type: "REDO" })}
        disabled={state.historyIndex === state.history.length - 1}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};

export default RedoUndo;
