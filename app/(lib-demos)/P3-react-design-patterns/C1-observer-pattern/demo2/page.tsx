"use client";

import React from "react";
import { ComponentA } from "./components/ComponentA";
import { ComponentB } from "./components/ComponentB";

/**
 * using event bus for cross-component communication is not common in React, but it can be useful in some cases.
 * https://claude.ai/chat/5e4bae05-9f89-4ef6-9322-ee0c012e13de
 * 
 * @returns 
 */
const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Event-Driven Communication Demo
      </h1>
      <ComponentA />
      <ComponentB />
    </div>
  );
};

export default App;
