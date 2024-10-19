"use client";

import React, { useEffect, useState } from "react";
import { create } from "zustand";

// Define the store
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Counter component
const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Count: {count}
      </h2>
      <div className="flex justify-center space-x-4">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          Decrement
        </button>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

// Observer component
const CountObserver: React.FC = () => {
  const [lastAction, setLastAction] = useState<string>("");

  useEffect(() => {
    const unsubscribe = useCounterStore.subscribe((state, prevState) => {
      if (state.count > prevState.count) {
        setLastAction("incremented");
      } else if (state.count < prevState.count) {
        setLastAction("decremented");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <p className="text-center mt-4 text-gray-600 font-medium">
      Last action: <span className="text-indigo-600">{lastAction}</span>
    </p>
  );
};

// App component
const App: React.FC = () => {
  return (
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Zustand Counter
          </h1>
          <Counter />
          <CountObserver />
        </div>
      </div>
    </div>
  );
};

export default App;
