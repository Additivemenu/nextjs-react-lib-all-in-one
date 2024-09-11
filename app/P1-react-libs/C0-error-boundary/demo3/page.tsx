"use client";
import React, { useState, useRef, useEffect } from "react";
import { set } from "react-hook-form";
import BombPanel from "./panel-contents/BombPanel";
import NormalPanel from "./panel-contents/NormalPanel";
import { ErrorBoundary } from "react-error-boundary";
import FallbackPanel from "./panel-contents/FallbackPanel";

type PanelControl = {
  PanelType: "BombPanel" | "NormalPanel";
};

// SidePanel component
const SidePanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [isInViewport, setIsInViewport] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Handle when the panel is in the viewport
  useEffect(() => {
    // ! the IntersectionObserver API is useful for lazy loading images, infinite scrolling, and more
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
          } else {
            setIsInViewport(false);
          }
        });
      },
      {
        threshold: 0.1, // 10% of the panel should be visible to trigger
      },
    );

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, []);

  const [panelControl, setPanelControl] = useState<PanelControl | null>(null);

  return (
    <div className="relative h-screen p-4">
      <div className="flex flex-col">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            if (!isVisible) {
              setIsVisible(true);
              setPanelControl({ PanelType: "BombPanel" });
            } else {
              setIsVisible(false);
              setPanelControl({ PanelType: "BombPanel" });
            }
          }}
        >
          Open Bomb Panel
        </button>

        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            if (!isVisible) {
              setIsVisible(true);
              setPanelControl({ PanelType: "NormalPanel" });
            } else {
              setIsVisible(false);
              setPanelControl({ PanelType: "NormalPanel" });
            }
          }}
        >
          Open Normal Panel
        </button>
      </div>

      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-300 shadow-lg transform transition-transform duration-500 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold p-4">Right Side Panel</h2>

        {/* FIXME: why is this not catching error?  */}
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => {
            return (
              <FallbackPanel
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            );
          }}
          onError={(error) => {
            alert(error.message);
          }}
          onReset={() => {}}
        >
          <BombPanel />

          {/* panel content in viewport */}
          {/* {isInViewport && panelControl?.PanelType === "BombPanel" && (
            <BombPanel />
          )} */}
          {/* {isInViewport && panelControl?.PanelType === "NormalPanel" && (
            <NormalPanel />
          )} */}

          {/* panel content outside  */}
          {/* {!isInViewport && (
            <p className="px-4">The panel is outside the viewport.</p>
          )} */}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SidePanel;
