"use client";

import React from "react";
import Select from "react-select";

// Define the option type
type OptionType = {
  value: number;
  label: string;
};

// Create 10,000 fake options
const options: OptionType[] = [];
for (let i = 0; i < 10000; i++) {
  options.push({ value: i, label: `Option ${i}` });
}

export default function VirtualizedSelect() {
  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h3>Large Dataset Select Demo</h3>
      <p>This dropdown has 10,000 options to demonstrate performance.</p>
      <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "20px" }}>
        <strong>Note:</strong> react-select handles large lists efficiently out
        of the box. For even better performance with 10,000+ items, you can
        integrate with react-window using a custom MenuList component.
      </p>
      <Select
        options={options}
        placeholder="Search through 10,000 options..."
        isSearchable
      />

      <div style={{ marginTop: "30px", fontSize: "0.9em", color: "#666" }}>
        <strong>Performance Tips:</strong>
        <ul>
          <li>
            react-select uses virtualization-like techniques internally for
            rendering
          </li>
          <li>
            The <code>isSearchable</code> prop allows filtering to reduce
            visible items
          </li>
          <li>
            For extremely large datasets (100k+), consider implementing custom
            virtualization
          </li>
        </ul>
      </div>
    </div>
  );
}
