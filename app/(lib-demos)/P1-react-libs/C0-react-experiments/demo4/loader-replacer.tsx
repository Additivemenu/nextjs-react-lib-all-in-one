import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

const LoaderReplacer = () => {
  useEffect(() => {
    // Create our custom loader element
    const createCustomLoader = () => {
      const customLoader = document.createElement("div");
      customLoader.className = "flex items-center justify-center p-2";
      // Using Tailwind classes for styling
      customLoader.innerHTML = `
        <div class="animate-spin text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      `;
      return customLoader;
    };

    // Callback function to handle DOM mutations
    const callback = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.classList.contains("rcb-typing-indicator")
          ) {
            // Clear the original content
            node.innerHTML = "";
            // Add our custom loader
            node.appendChild(createCustomLoader());
            // Optionally, modify the original element's styles
            node.style.backgroundColor = "transparent";
            // You can also add new classes to the original element
            node.classList.add("custom-loader-container");
          }
        });
      });
    };

    // Create and setup the observer
    const observer = new MutationObserver(callback);

    // Start observing with specific configuration
    observer.observe(document.body, {
      childList: true, // Watch for child elements being added/removed
      subtree: true, // Watch all descendants, not just direct children
    });

    // Cleanup function
    return () => observer.disconnect();
  }, []); // Empty dependency array since we only want to set this up once

  // This component doesn't render anything itself
  return null;
};

export default LoaderReplacer;
