"use client";

import React, { useEffect, useState } from "react";
import { driver, DriveStep, Config } from "driver.js";
import "driver.js/dist/driver.css";
import { Settings, HelpCircle } from "lucide-react";

const AdvancedOnboarding = () => {
  const [driverObj, setDriverObj] = useState<ReturnType<typeof driver> | null>(
    null,
  );
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);

  const onTourComplete = () => {
    setHasCompletedTour(true);
    localStorage.setItem("hasCompletedTour", "true");
  };

  // Custom styles for driver.js
  const driverConfig: Config = {
    animate: true,
    showProgress: true,
    allowClose: true,
    stagePadding: 4,
    popoverClass: "custom-popover",
    onDestroyed: () => {
      console.log("Tour was destroyed");
    },
    steps: [
      {
        element: "#welcome-header",
        popover: {
          title: "Welcome to Our App",
          description: "Let us show you around our main features!",
          side: "bottom" as const,
          align: "start",
        },
      },
      {
        element: "#feature-section",
        popover: {
          title: "Key Features",
          description: "Discover all the powerful features we offer",
          side: "right" as const,
        },
      },
      {
        element: "#new-user-guide",
        popover: {
          title: "New User Guide",
          description: "Special resources to help you get started!",
          side: "bottom" as const,
        },
      },
      {
        element: "#user-profile",
        popover: {
          title: "Your Profile",
          description: "Manage your settings and preferences here",
          side: "left" as const,
        },
      },
      {
        element: "#help-section",
        popover: {
          title: "Need Help?",
          description: "Our support team is always here to help!",
          side: "top" as const,
        },
      },
    ],
  };

  useEffect(() => {
    const driverInstance = driver({
      ...driverConfig,
      onDestroyStarted: () => {
        onTourComplete();
      },
    });
    setDriverObj(driverInstance);

    const tourCompleted = localStorage.getItem("hasCompletedTour");
    if (tourCompleted) {
      setHasCompletedTour(true);
    }

    return () => {
      driverInstance.destroy();
    };
  }, [isNewUser]);

  const startTour = () => {
    if (driverObj) {
      driverObj.drive();
    }
  };

  const resetTour = () => {
    localStorage.removeItem("hasCompletedTour");
    setHasCompletedTour(false);
    startTour();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 id="welcome-header" className="text-2xl font-bold">
          Welcome to Our Platform
        </h1>
        <div className="space-x-2">
          <button
            onClick={startTour}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Start Tour
          </button>
          {hasCompletedTour && (
            <button
              onClick={resetTour}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            >
              Reset Tour
            </button>
          )}
        </div>
      </div>

      <div
        id="feature-section"
        className="mb-4 p-4 border rounded hover:shadow-lg transition"
      >
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2 space-y-2">
          <li className="flex items-center">
            <span className="mr-2">📊</span>Advanced Analytics
          </li>
          <li className="flex items-center">
            <span className="mr-2">👥</span>Team Collaboration
          </li>
          <li className="flex items-center">
            <span className="mr-2">⚡</span>Real-time Updates
          </li>
        </ul>
      </div>

      {isNewUser && (
        <div id="new-user-guide" className="mb-4 p-4 border rounded bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-700">
            New User Guide
          </h2>
          <p className="mt-2">
            Special resources and tips to help you get started!
          </p>
        </div>
      )}

      <div
        id="user-profile"
        className="mb-4 p-4 border rounded hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <Settings className="text-gray-600" />
        </div>
        <div className="mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
            Edit Profile
          </button>
        </div>
      </div>

      <div
        id="help-section"
        className="p-4 border rounded hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Help Center</h2>
          <HelpCircle className="text-gray-600" />
        </div>
        <p className="mt-2">Need assistance? Contact our support team 24/7.</p>
      </div>

      <style jsx>{`
        .custom-popover {
          --driver-popover-bg: theme("colors.white");
          --driver-popover-progress-bg: theme("colors.blue.500");
        }

        .pulse-animation {
          animation: pulse 1s;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedOnboarding;
