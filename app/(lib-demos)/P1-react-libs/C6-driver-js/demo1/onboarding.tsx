"use client";

import React, { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const OnboardingDemo = () => {
  useEffect(() => {
    // Initialize driver.js
    const driverObj = driver({
      showProgress: true,
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
            description: "Manage your settings and preferences here",
            side: "left",
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
      ],
    });

    // Start the tour when component mounts
    driverObj.drive();

    return () => {
      // Cleanup
      driverObj.destroy();
    };
  }, []);

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
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
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
