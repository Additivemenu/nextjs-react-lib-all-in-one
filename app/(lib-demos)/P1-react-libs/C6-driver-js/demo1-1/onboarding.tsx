"use client";
import React, { useEffect, useState } from "react";
import { Driver, driver } from "driver.js";
import "driver.js/dist/driver.css";

const OnboardingDemo = () => {
  const [driverObj, setDriverObj] = useState<Driver | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Initialize driver.js
    const driverInstance = driver({
      showProgress: true,
      allowClose: false, // ! constraint user to close the tour and click outside the popover
      onHighlightStarted: (element, step) => {
        step.element === "#user-profile" && setCurrentStep(2);
      },
      steps: [
        {
          element: "#welcome-header",
          popover: {
            title: "Welcome to Our App",
            description: "Let us show you around our main features!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#feature-section",
          popover: {
            title: "Key Features",
            description: "Discover all the powerful features we offer",
            side: "right",
          },
        },
        {
          element: "#user-profile",
          popover: {
            title: "Your Profile",
            description:
              'Click the Edit Profile button to continue!  <img src="https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" /> ',
            side: "left",
            showButtons: ["close"],
          },
        },
        {
          element: "#help-section",
          popover: {
            title: "Need Help?",
            description: "Our support team is always here to help!",
            side: "top",
          },
        },
        {
          element: "#user-profile",
          popover: {
            title: "Your Profile",
            description: "Click the Edit Profile button to continue!",
            side: "left",
          },
        },
      ],
    });

    setDriverObj(driverInstance);
    // Start the tour when component mounts
    driverInstance.drive();

    return () => {
      // Cleanup
      driverInstance.destroy();
    };
  }, []);

  const handleProfileClick = () => {
    // If we're on the profile step (index 2), move to next step
    if (driverObj && currentStep === 2) {
      driverObj.moveNext();
    }
  };

  return (
    <div className="p-6">
      <h1 id="welcome-header" className="text-2xl font-bold mb-4">
        Welcome to Our Platform
      </h1>

      <div id="feature-section" className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2">
          <li>Advanced Analytics</li>
          <li>Team Collaboration</li>
          <li>Real-time Updates</li>
        </ul>
      </div>

      <div id="user-profile" className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <div className="mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleProfileClick}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div id="help-section" className="p-4 border rounded">
        <h2 className="text-xl font-semibold">Help Center</h2>
        <p className="mt-2">Need assistance? Contact our support team 24/7.</p>
      </div>
    </div>
  );
};

export default OnboardingDemo;
