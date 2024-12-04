"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { STATUS, Step, CallBackProps } from "react-joyride";

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const Onboarding = () => {
  const [runTour, setRunTour] = useState(false);

  const steps: Step[] = [
    {
      target: "#welcome-header",
      content: "welcome to our platform!",
      placement: "bottom-start",
    },
    {
      target: "#feature-section",
      content: "key features of our platform",
      placement: "right",
    },
    {
      target: "#user-profile",
      content: "your profile settings",
      placement: "left",
    },
    {
      target: "#help-section",
      content: "need help? contact our support team",
      placement: "top",
    },
  ];

  useEffect(() => {
    // Start the tour when component mounts
    setRunTour(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "#3B82F6", // matches the blue-500 color from the UI
          },
        }}
      />

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
          <p className="mt-2">
            Need assistance? Contact our support team 24/7.
          </p>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
