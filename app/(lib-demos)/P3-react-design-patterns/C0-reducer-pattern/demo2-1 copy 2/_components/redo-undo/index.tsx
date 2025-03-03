import React from "react";
import { useTaskStore } from "../../_stores/task-store";

const RedoUndo = () => {
  const historyIndex = useTaskStore((state) => state.historyIndex);
  const historyLength = useTaskStore((state) => state.history.length);
  const undo = useTaskStore((state) => state.undo);
  const redo = useTaskStore((state) => state.redo);

  return (
    <div className="flex justify-end">
      <button
        onClick={undo}
        disabled={historyIndex === 0}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Undo
      </button>
      <button
        onClick={redo}
        disabled={historyIndex === historyLength - 1}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};

export default RedoUndo;
