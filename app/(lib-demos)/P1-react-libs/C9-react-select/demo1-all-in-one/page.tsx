"use client";

import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import type { StylesConfig } from "react-select";

// Define the option type
type ColorOption = {
  value: string;
  label: string;
  color: string;
};

// 1. DATA: Imagine this is your backend database
const colorOptions: ColorOption[] = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

// 2. SEARCH LOGIC: Simulates an API call with a delay
const filterColors = (inputValue: string): ColorOption[] => {
  return colorOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};

const loadOptions = (
  inputValue: string,
  callback: (options: ColorOption[]) => void,
): void => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000); // Fakes a 1-second network delay
};

// 3. STYLING LOGIC: Dynamic styles based on data
const customStyles: StylesConfig<ColorOption, true> = {
  // Style the options in the dropdown
  option: (styles, { data, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? data.color
        : isFocused
          ? `${data.color}20` // Add transparency for hover effect
          : undefined,
      color: isSelected ? "white" : data.color,
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: isSelected ? data.color : `${data.color}50`,
      },
    };
  },
  // Style the "chips" (selected items)
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: `${data.color}20`, // Light background
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
    fontWeight: "bold",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

export default function SuperSelectDemo() {
  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h3>The &ldquo;React-Select&rdquo; Power Demo</h3>
      <p>Try typing &ldquo;Blue&rdquo;, or select multiple colors.</p>

      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        isMulti // <--- Enables multi-select instantly
        styles={customStyles} // <--- Injects the custom coloring
        placeholder="Search for a color..."
      />

      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        <strong>What is happening here?</strong>
        <ul>
          <li>Native &lt;select&gt; cannot search asynchronously.</li>
          <li>
            Native &lt;select&gt; cannot style options individually (look at the
            colors!).
          </li>
          <li>
            Native &lt;select&gt; cannot do multi-select &ldquo;chips&rdquo;
            like this.
          </li>
        </ul>
      </div>
    </div>
  );
}
