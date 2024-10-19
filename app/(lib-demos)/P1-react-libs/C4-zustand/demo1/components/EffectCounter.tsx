import { useEffect, useState } from "react";
import { useStore } from "../store/counter";

// Component using useEffect
export const EffectCounter: React.FC = () => {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const [effectLog, setEffectLog] = useState<string[]>([]);

  useEffect(() => {
    const newLog = `Effect: Count is now ${count}`;
    setEffectLog((prev) => [...prev, newLog]);
    console.log(newLog);
  }, [count]);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Effect Counter</h2>
      <p>Count: {count}</p>
      <button
        onClick={increment}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Increment
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Effect Logs:</h3>
        <ul>
          {effectLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
