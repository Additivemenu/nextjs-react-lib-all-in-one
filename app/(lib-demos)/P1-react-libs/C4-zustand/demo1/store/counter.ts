import React, { useEffect, useState } from "react";
import { create } from "zustand";
import ReactDOM from "react-dom";

// Define our Zustand store type
interface CounterState {
  count: number;
  increment: () => void;
}

// Create the store with TypeScript types
export const useStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
