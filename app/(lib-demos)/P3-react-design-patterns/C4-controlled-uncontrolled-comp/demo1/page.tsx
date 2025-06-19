"use client";

import { useState, useRef } from "react";
import ComparisonTable from "./components/ComparisonTable";
import ControlledComponent from "./components/ControlledComponent";
import UncontrolledComponent from "./components/UncontrolledComponent";

export default function ComponentDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Controlled vs Uncontrolled Components
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <ControlledComponent />

          <UncontrolledComponent />
        </div>

        <ComparisonTable />
      </div>
    </div>
  );
}
